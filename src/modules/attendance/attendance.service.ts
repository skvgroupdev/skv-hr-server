import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AttendanceRepository } from './attendance.repository';
import { GeofenceService } from './geofence.service';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { EmployeesRepository } from '../employees/employees.repository';
import { BranchesRepository } from '../branches/branches.repository';
import { ShiftsRepository } from '../shifts/shifts.repository';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { AdjustAttendanceDto } from './dto/adjust-attendance.dto';
import { AttendanceHistoryQueryDto, AttendanceReportQueryDto } from './dto/attendance-query.dto';
import type { AttendanceStatus } from './schemas/attendance-log.schema';
import type { ShiftAssignmentDocument } from '../shifts/schemas/shift-assignment.schema';
import { NotificationsService } from '../notifications/notifications.service';

const MAX_LIMIT = 100;

const TIMEZONE = 'Asia/Bangkok';

// Returns "YYYY-MM-DD" in Bangkok timezone (UTC+7) without relying on toLocaleDateString
// which behaves differently across Node versions and locales
function toBangkokDateKey(date: Date): string {
  const bangkokMs = date.getTime() + 7 * 60 * 60 * 1000;
  return new Date(bangkokMs).toISOString().slice(0, 10);
}

export interface DailyRecord {
  date: string;
  checkIn: Date | null;
  checkOut: Date | null;
  status: import('./schemas/attendance-log.schema').AttendanceStatus | null;
  lateMinutes: number;
  workDuration: number | null;
  isInsideGeofence: boolean | null;
  distanceFromBranch: number | null;
}

function toDailyRecord(
  dateKey: string,
  logs: Array<{ type: string; checkTime: Date; status: import('./schemas/attendance-log.schema').AttendanceStatus; lateMinutes: number; isInsideGeofence?: boolean; distanceFromBranch?: number }>,
): DailyRecord {
  const checkIns = logs
    .filter((l) => l.type === 'CHECK_IN')
    .sort((a, b) => a.checkTime.getTime() - b.checkTime.getTime());
  const checkOuts = logs
    .filter((l) => l.type === 'CHECK_OUT')
    .sort((a, b) => b.checkTime.getTime() - a.checkTime.getTime());

  const checkInLog = checkIns[0] ?? null;
  const checkOutLog = checkOuts[0] ?? null;

  const workDuration =
    checkInLog && checkOutLog
      ? Math.round((checkOutLog.checkTime.getTime() - checkInLog.checkTime.getTime()) / 60000)
      : null;

  return {
    date: dateKey,
    checkIn: checkInLog?.checkTime ?? null,
    checkOut: checkOutLog?.checkTime ?? null,
    status: checkInLog?.status ?? null,
    lateMinutes: checkInLog?.lateMinutes ?? 0,
    workDuration,
    isInsideGeofence: checkInLog?.isInsideGeofence ?? null,
    distanceFromBranch: checkInLog?.distanceFromBranch ?? null,
  };
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Returns minutes since midnight in Asia/Bangkok timezone.
 * Using getHours() directly would read UTC on production servers (Linux/Docker default UTC),
 * causing check-in at 20:00 Bangkok (= 13:00 UTC) to be read as 780 min instead of 1200.
 */
function getMinutesSinceMidnight(date: Date): number {
  // UTC+7 fixed offset — same pattern as toBangkokDateKey() in this file
  const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000
  const bangkokMs = date.getTime() + BANGKOK_OFFSET_MS
  return Math.floor(bangkokMs / 60_000) % 1440
}

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private readonly geofenceService: GeofenceService,
    private readonly auditLogService: AuditLogService,
    private readonly employeesRepository: EmployeesRepository,
    private readonly branchesRepository: BranchesRepository,
    private readonly shiftsRepository: ShiftsRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async checkIn(tenantId: string, userId: string, dto: CheckInDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);

    const { distance, isInside, branchId } = await this.checkGeofence(
      employee,
      tenantObjectId,
      dto.lat,
      dto.lng,
    );

    if (!isInside && !dto.isOffsite) {
      return { blocked: true, distanceFromBranch: distance, message: 'ອຍູ່ອອກວຽກນອກ' };
    }

    const existingCheckIn = await this.attendanceRepository.findTodayCheckIn(
      employee._id as Types.ObjectId,
      tenantObjectId,
    );
    if (existingCheckIn) throw new BadRequestException('ທ່ານ check in ແລ້ວ');

    await this.guardWorkDay(employee._id as Types.ObjectId, tenantObjectId);
    await this.guardCheckInWindow(employee._id as Types.ObjectId, tenantObjectId);

    const serverTime = new Date();
    const { status, lateMinutes } = await this.calculateCheckInStatus(
      employee._id as Types.ObjectId,
      tenantObjectId,
      serverTime,
    );

    const log = await this.attendanceRepository.create({
      tenantId: tenantObjectId,
      employeeId: employee._id as Types.ObjectId,
      branchId: branchId ?? undefined,
      type: 'CHECK_IN',
      checkTime: serverTime,
      serverTime,
      location: { type: 'Point', coordinates: [dto.lng, dto.lat] },
      gpsAccuracy: dto.gpsAccuracy,
      distanceFromBranch: distance,
      isInsideGeofence: isInside,
      selfieUrl: dto.selfieUrl,
      deviceId: dto.deviceId,
      note: dto.note,
      status,
      lateMinutes,
    });

    await this.sendCheckInNotification(employee, tenantId, serverTime, status);

    return log;
  }

  async checkOut(tenantId: string, userId: string, dto: CheckOutDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);

    const existingCheckIn = await this.attendanceRepository.findTodayCheckIn(
      employee._id as Types.ObjectId,
      tenantObjectId,
    );
    if (!existingCheckIn) throw new BadRequestException('ບໍ່ພົບການ check in');

    await this.guardCheckOutWindow(employee._id as Types.ObjectId, tenantObjectId, dto.earlyLeaveReason);

    const { distance, isInside, branchId } = await this.checkGeofence(
      employee,
      tenantObjectId,
      dto.lat,
      dto.lng,
    );

    const serverTime = new Date();
    const status = await this.calculateCheckOutStatus(
      employee._id as Types.ObjectId,
      tenantObjectId,
      serverTime,
    );

    const log = await this.attendanceRepository.create({
      tenantId: tenantObjectId,
      employeeId: employee._id as Types.ObjectId,
      branchId: branchId ?? undefined,
      type: 'CHECK_OUT',
      checkTime: serverTime,
      serverTime,
      location: { type: 'Point', coordinates: [dto.lng, dto.lat] },
      gpsAccuracy: dto.gpsAccuracy,
      distanceFromBranch: distance,
      isInsideGeofence: isInside,
      selfieUrl: dto.selfieUrl,
      deviceId: dto.deviceId,
      status,
      ...(status === 'EARLY_LEAVE' && dto.earlyLeaveReason ? { earlyLeaveReason: dto.earlyLeaveReason } : {}),
    });

    return log;
  }

  async getMyToday(tenantId: string, userId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
    return this.attendanceRepository.findTodayLogs(employee._id as Types.ObjectId, tenantObjectId);
  }

  async getMyHistory(tenantId: string, userId: string, query: AttendanceHistoryQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    const { days, total } = await this.attendanceRepository.findDailyPaginated(
      tenantObjectId,
      employee._id as Types.ObjectId,
      page,
      limit,
      startDate,
      endDate,
    );

    const data = days.map((day) => toDailyRecord(day._id, day.logs as Parameters<typeof toDailyRecord>[1]));

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getOne(tenantId: string, id: string) {
    const log = await this.attendanceRepository.findById(id, new Types.ObjectId(tenantId));
    if (!log) throw new NotFoundException('Attendance log not found');
    return log;
  }

  async manualAdjust(tenantId: string, id: string, actorId: string, dto: AdjustAttendanceDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.attendanceRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Attendance log not found');

    const updateData: Record<string, unknown> = {
      status: 'MANUAL_ADJUSTED',
      adjustedBy: new Types.ObjectId(actorId),
      adjustReason: dto.reason,
    };
    if (dto.type) updateData.type = dto.type;
    if (dto.checkTime) updateData.checkTime = new Date(dto.checkTime);
    if (dto.note) updateData.note = dto.note;

    const updated = await this.attendanceRepository.updateLog(id, tenantObjectId, updateData);

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole: 'HR_ADMIN',
      action: 'CREATE_MANUAL_ADJUSTMENT',
      module: 'attendance',
      targetId: new Types.ObjectId(id),
      before: { type: existing.type, checkTime: existing.checkTime, status: existing.status },
      after: updateData,
    });

    return updated;
  }

  async getNotCheckedInReport(tenantId: string, query: AttendanceReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const date = query.date ? new Date(query.date) : new Date();
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    const branchObjectId = query.branchId ? new Types.ObjectId(query.branchId) : undefined;

    const [checkedInIds, activeEmployees] = await Promise.all([
      this.attendanceRepository.findCheckedInEmployeeIds(tenantObjectId, start, end),
      this.employeesRepository.findAllActive(tenantObjectId, branchObjectId),
    ]);

    const checkedInSet = new Set(checkedInIds);
    let notCheckedIn = activeEmployees.filter(
      (e) => !checkedInSet.has((e._id as Types.ObjectId).toString()),
    );

    if (notCheckedIn.length === 0) return [];

    const employeeObjectIds = notCheckedIn.map((e) => e._id as Types.ObjectId);
    const assignments = await this.shiftsRepository.findCurrentAssignmentsByEmployeeIds(
      employeeObjectIds,
      tenantObjectId,
    );
    const assignmentMap = new Map(assignments.map((a) => [a.employeeId.toString(), a]));

    // Filter out employees whose shift does not include the query date's day of week
    const bangkokDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const queryDayOfWeek = bangkokDate.getUTCDay();

    notCheckedIn = notCheckedIn.filter((emp) => {
      const assignment = assignmentMap.get((emp._id as Types.ObjectId).toString());
      if (!assignment) return true; // no shift assigned → always show
      const shift = assignment.shiftId as unknown as { workDays?: number[] } | null | undefined;
      const workDays: number[] = shift?.workDays ?? [1, 2, 3, 4, 5];
      return workDays.includes(queryDayOfWeek);
    });

    const todayKey = toBangkokDateKey(new Date());
    const isToday = toBangkokDateKey(date) === todayKey;
    const nowMinutesBangkok = isToday ? getMinutesSinceMidnight(new Date()) : null;

    return notCheckedIn
      .map((emp) => this.toNotCheckedInItem(emp, assignmentMap, isToday, nowMinutesBangkok))
      .filter((item) => item !== null);
  }

  private toNotCheckedInItem(
    emp: { _id: unknown; employeeCode?: string; firstName: string; lastName: string; positionId?: unknown; branchId?: unknown },
    assignmentMap: Map<string, ShiftAssignmentDocument>,
    isToday: boolean,
    nowMinutesBangkok: number | null,
  ) {
    const empId = (emp._id as Types.ObjectId).toString();
    const assignment = assignmentMap.get(empId);
    const shift = assignment?.shiftId as unknown as { startTime?: string } | null | undefined;
    const shiftStartTime = shift?.startTime ?? null;

    // For today: skip employees whose shift hasn't started yet
    if (isToday && shiftStartTime && nowMinutesBangkok !== null) {
      if (parseTimeToMinutes(shiftStartTime) > nowMinutesBangkok) return null;
    }

    const position = emp.positionId as { _id: unknown; name: string } | null | undefined;
    const branch = emp.branchId as { _id: unknown; name: string } | null | undefined;

    return {
      id: empId,
      employeeCode: emp.employeeCode ?? '',
      firstName: emp.firstName,
      lastName: emp.lastName,
      position: position ? { id: (position._id as Types.ObjectId).toString(), name: position.name } : null,
      branch: branch ? { id: (branch._id as Types.ObjectId).toString(), name: branch.name } : null,
      shiftStartTime,
    };
  }

  async getSummary(tenantId: string, date: Date) {
    const tenantObjId = new Types.ObjectId(tenantId);

    const [{ checkedIn, late }, total] = await Promise.all([
      this.attendanceRepository.getSummaryForDate(tenantObjId, date),
      this.employeesRepository.countActive(tenantObjId),
    ]);

    return {
      date: date.toISOString().split('T')[0],
      total,
      checkedIn,
      late,
      notCheckedIn: Math.max(0, total - checkedIn),
    };
  }

  async getDailyReport(tenantId: string, query: AttendanceReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const date = query.date ? new Date(query.date) : new Date();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const branchId = query.branchId ? new Types.ObjectId(query.branchId) : undefined;
    const logs = await this.attendanceRepository.findByDateRange(tenantObjectId, start, end, branchId);

    return this.populateEmployees(logs, tenantObjectId);
  }

  private async populateEmployees(
    logs: Array<{ employeeId: Types.ObjectId; toObject?: () => Record<string, unknown> }>,
    tenantId: Types.ObjectId,
  ) {
    if (logs.length === 0) return [];

    const uniqueEmpIds = [...new Set(logs.map((l) => l.employeeId.toString()))];
    const employees = await this.employeesRepository.findByIds(uniqueEmpIds, tenantId);
    const empMap = new Map(employees.map((e) => [(e._id as Types.ObjectId).toString(), e]));

    return logs.map((log) => ({
      ...(log.toObject ? log.toObject() : log),
      employee: empMap.get(log.employeeId.toString()) ?? null,
    }));
  }

  async getMonthlyReport(tenantId: string, query: AttendanceReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const year = parseInt(query.year ?? String(new Date().getFullYear()), 10);
    const month = parseInt(query.month ?? String(new Date().getMonth() + 1), 10);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const branchId = query.branchId ? new Types.ObjectId(query.branchId) : undefined;
    const logs = await this.attendanceRepository.findByDateRange(tenantObjectId, start, end, branchId);
    return logs;
  }

  async getLateReport(tenantId: string, query: AttendanceReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const start = query.startDate ? new Date(query.startDate) : new Date();
    const end = query.endDate ? new Date(query.endDate) : new Date();
    const branchId = query.branchId ? new Types.ObjectId(query.branchId) : undefined;
    return this.attendanceRepository.findByStatus(tenantObjectId, 'LATE', start, end, branchId);
  }

  async getAbsentReport(tenantId: string, query: AttendanceReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const date = query.date ? new Date(query.date) : new Date();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const branchId = query.branchId ? new Types.ObjectId(query.branchId) : undefined;
    return this.attendanceRepository.findByStatus(tenantObjectId, 'ABSENT', start, end, branchId);
  }

  private async findEmployeeByUserId(userId: string, tenantId: Types.ObjectId) {
    const employee = await this.employeesRepository.findByUserIdAndTenant(
      new Types.ObjectId(userId),
      tenantId,
    );
    if (!employee) throw new NotFoundException('Employee profile not found');
    return employee;
  }

  private async checkGeofence(
    employee: { branchId?: Types.ObjectId | null },
    tenantId: Types.ObjectId,
    lat: number,
    lng: number,
  ) {
    if (!employee.branchId) {
      return { distance: 0, isInside: true, branchId: null };
    }

    const branch = await this.branchesRepository.findById(
      employee.branchId.toString(),
      tenantId,
    );

    if (!branch?.location?.coordinates) {
      return { distance: 0, isInside: true, branchId: employee.branchId };
    }

    const [branchLng, branchLat] = branch.location.coordinates;
    const distance = this.geofenceService.calculateDistance(lat, lng, branchLat, branchLng);
    const isInside = distance <= (branch.radiusMeters ?? 100);

    return { distance, isInside, branchId: employee.branchId };
  }

  private async calculateCheckInStatus(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
    serverTime: Date,
  ): Promise<{ status: AttendanceStatus; lateMinutes: number }> {
    const assignment = await this.shiftsRepository.findCurrentAssignment(employeeId, tenantId);
    // shiftId is a raw ObjectId (not populated) when the shift was deleted/deactivated —
    // treat it the same as no shift to avoid falling through with undefined startTime → NORMAL
    const shiftPopulated = assignment?.shiftId;
    if (
      !shiftPopulated ||
      typeof shiftPopulated !== 'object' ||
      !('startTime' in shiftPopulated)
    ) {
      return { status: 'NORMAL', lateMinutes: 0 };
    }

    const shift = shiftPopulated as unknown as { startTime?: string; gracePeriodMinutes?: number };
    if (!shift.startTime) return { status: 'NORMAL', lateMinutes: 0 };

    const shiftStartMinutes = parseTimeToMinutes(shift.startTime);
    const actualMinutes = getMinutesSinceMidnight(serverTime);
    const lateMinutes = Math.max(0, actualMinutes - shiftStartMinutes);
    const gracePeriod = shift.gracePeriodMinutes ?? 15;

    if (lateMinutes === 0) return { status: 'NORMAL', lateMinutes: 0 };
    if (lateMinutes <= gracePeriod) return { status: 'LATE_MINOR', lateMinutes };
    return { status: 'LATE', lateMinutes };
  }

  private async guardWorkDay(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
  ): Promise<void> {
    const assignment = await this.shiftsRepository.findCurrentAssignment(employeeId, tenantId);
    const shiftPopulated = assignment?.shiftId;
    if (!shiftPopulated || typeof shiftPopulated !== 'object') return;

    const shift = shiftPopulated as unknown as { workDays?: number[] };
    const workDays: number[] = shift.workDays ?? [1, 2, 3, 4, 5];

    const bangkokDate = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const todayDow = bangkokDate.getUTCDay();

    if (!workDays.includes(todayDow)) {
      throw new BadRequestException('ບໍ່ໄດ້ທຳງານໃນມື້ນີ້ຕາມຕາຕະລາງກະ');
    }
  }

  private async guardCheckInWindow(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
  ): Promise<void> {
    const assignment = await this.shiftsRepository.findCurrentAssignment(employeeId, tenantId);
    const shiftPopulated = assignment?.shiftId;
    if (!shiftPopulated || typeof shiftPopulated !== 'object' || !('startTime' in shiftPopulated)) return;

    const shift = shiftPopulated as unknown as { startTime?: string; endTime?: string };
    if (!shift.startTime) return;

    const shiftStartMinutes = parseTimeToMinutes(shift.startTime);
    const windowOpenMinutes = shiftStartMinutes - 120;
    const nowMinutes = getMinutesSinceMidnight(new Date());

    if (nowMinutes < windowOpenMinutes) {
      const openHour = Math.floor(windowOpenMinutes / 60).toString().padStart(2, '0');
      const openMin = (windowOpenMinutes % 60).toString().padStart(2, '0');
      throw new BadRequestException(`ສາມາດ Check-in ໄດ້ຕັ້ງແຕ່ ${openHour}:${openMin}`);
    }

    // Block check-in after shift end + 2-hour grace (prevents next-day or wrong-shift logins)
    if (shift.endTime) {
      const shiftEndMinutes = parseTimeToMinutes(shift.endTime);
      const windowCloseMinutes = shiftEndMinutes + 120;
      if (nowMinutes > windowCloseMinutes) {
        throw new BadRequestException(`ໝົດເວລາ Check-in ແລ້ວ (ກະສິ້ນສຸດ ${shift.endTime})`);
      }
    }
  }

  private async guardCheckOutWindow(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
    earlyLeaveReason?: string,
  ): Promise<void> {
    const assignment = await this.shiftsRepository.findCurrentAssignment(employeeId, tenantId);
    const shiftPopulated = assignment?.shiftId;
    if (!shiftPopulated || typeof shiftPopulated !== 'object' || !('endTime' in shiftPopulated)) return;

    const shift = shiftPopulated as unknown as { endTime?: string; isOvernight?: boolean };
    if (!shift.endTime) return;

    const shiftEndMinutes = parseTimeToMinutes(shift.endTime);
    const nowMinutes = getMinutesSinceMidnight(new Date());

    if (!shift.isOvernight && nowMinutes < shiftEndMinutes) {
      if (!earlyLeaveReason) {
        throw new BadRequestException('ກະລຸນາລະບຸເຫດຜົນການອອກກ່ອນເວລາ');
      }
    }
  }

  private async sendCheckInNotification(
    employee: { userId?: Types.ObjectId | null },
    tenantId: string,
    checkTime: Date,
    status: AttendanceStatus,
  ): Promise<void> {
    if (!employee.userId) return;

    const statusLabel: Record<string, string> = {
      NORMAL: 'ທັນເວລາ',
      LATE_MINOR: 'ຊ້າໜ້ອຍ',
      LATE: 'ຊ້າ',
    };

    await this.notificationsService.notify(employee.userId, {
      tenantId,
      title: 'Check-in ສຳເລັດ',
      body: `ທ່ານ Check-in ເວລາ ${checkTime.toLocaleTimeString('lo-LA')} — ${statusLabel[status] ?? status}`,
      type: 'ATTENDANCE_LATE',
    });
  }

  private async calculateCheckOutStatus(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
    serverTime: Date,
  ): Promise<AttendanceStatus> {
    const assignment = await this.shiftsRepository.findCurrentAssignment(employeeId, tenantId);
    const shiftPopulated = assignment?.shiftId;
    if (!shiftPopulated || typeof shiftPopulated !== 'object' || !('endTime' in shiftPopulated)) return 'NORMAL';

    const shift = shiftPopulated as unknown as { endTime?: string };
    if (!shift.endTime) return 'NORMAL';

    const shiftEndMinutes = parseTimeToMinutes(shift.endTime);
    const checkOutMinutes = getMinutesSinceMidnight(serverTime);

    return checkOutMinutes < shiftEndMinutes ? 'EARLY_LEAVE' : 'NORMAL';
  }
}
