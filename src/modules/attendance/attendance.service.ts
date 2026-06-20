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
import {
  AttendanceHistoryQueryDto,
  AttendanceReportQueryDto,
} from './dto/attendance-query.dto';
import type { AttendanceStatus } from './schemas/attendance-log.schema';
import type { ShiftAssignmentDocument } from '../shifts/schemas/shift-assignment.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { CompanyPoliciesService } from '../company-policies/company-policies.service';

const MAX_LIMIT = 100;

const TIMEZONE = 'Asia/Bangkok';

interface WorkSchedule {
  source: 'UNIFORM' | 'SHIFT';
  startTime?: string;
  endTime?: string;
  workDays: number[];
  gracePeriodMinutes: number;
  isOvernight: boolean;
  shiftId?: string;
  policyId?: string;
}

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
  logs: Array<{
    _id?: Types.ObjectId;
    correctionFor?: Types.ObjectId;
    type: string;
    checkTime: Date;
    status: import('./schemas/attendance-log.schema').AttendanceStatus;
    lateMinutes: number;
    isInsideGeofence?: boolean;
    distanceFromBranch?: number;
  }>,
): DailyRecord {
  const effectiveLogs = withoutSupersededLogs(logs);
  const checkIns = effectiveLogs
    .filter((l) => l.type === 'CHECK_IN')
    .sort((a, b) => a.checkTime.getTime() - b.checkTime.getTime());
  const checkOuts = effectiveLogs
    .filter((l) => l.type === 'CHECK_OUT')
    .sort((a, b) => b.checkTime.getTime() - a.checkTime.getTime());

  const checkInLog = checkIns[0] ?? null;
  const checkOutLog = checkOuts[0] ?? null;

  const workDuration =
    checkInLog && checkOutLog
      ? Math.round(
          (checkOutLog.checkTime.getTime() - checkInLog.checkTime.getTime()) /
            60000,
        )
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

function withoutSupersededLogs<
  T extends { _id?: unknown; correctionFor?: unknown },
>(logs: T[]): T[] {
  const supersededIds = new Set(
    logs
      .filter((log) => log.correctionFor)
      .map((log) => String(log.correctionFor)),
  );
  return logs.filter((log) => !log._id || !supersededIds.has(String(log._id)));
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
  const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;
  const bangkokMs = date.getTime() + BANGKOK_OFFSET_MS;
  return Math.floor(bangkokMs / 60_000) % 1440;
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
    private readonly companyPoliciesService: CompanyPoliciesService,
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
      return {
        blocked: true,
        distanceFromBranch: distance,
        message: 'ອຍູ່ອອກວຽກນອກ',
      };
    }

    const existingCheckIn = await this.attendanceRepository.findTodayCheckIn(
      employee._id as Types.ObjectId,
      tenantObjectId,
    );
    if (existingCheckIn) throw new BadRequestException('ທ່ານ check in ແລ້ວ');

    const schedule = await this.resolveWorkSchedule(
      employee._id as Types.ObjectId,
      tenantObjectId,
      new Date(),
    );
    this.guardWorkDay(schedule);
    this.guardCheckInWindow(schedule);

    const serverTime = new Date();
    const { status, lateMinutes } = await this.calculateCheckInStatus(
      serverTime,
      schedule,
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
      ...(schedule ? { scheduleSnapshot: { ...schedule } } : {}),
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

    const schedule = await this.resolveWorkSchedule(
      employee._id as Types.ObjectId,
      tenantObjectId,
      new Date(),
    );
    this.guardCheckOutWindow(schedule, dto.earlyLeaveReason);

    const { distance, isInside, branchId } = await this.checkGeofence(
      employee,
      tenantObjectId,
      dto.lat,
      dto.lng,
    );

    const serverTime = new Date();
    const status = await this.calculateCheckOutStatus(serverTime, schedule);

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
      ...(schedule ? { scheduleSnapshot: { ...schedule } } : {}),
      ...(status === 'EARLY_LEAVE' && dto.earlyLeaveReason
        ? { earlyLeaveReason: dto.earlyLeaveReason }
        : {}),
    });

    return log;
  }

  async getMyToday(tenantId: string, userId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
    return this.attendanceRepository.findTodayLogs(
      employee._id as Types.ObjectId,
      tenantObjectId,
    );
  }

  async getMyHistory(
    tenantId: string,
    userId: string,
    query: AttendanceHistoryQueryDto,
  ) {
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

    const data = days.map((day) =>
      toDailyRecord(day._id, day.logs as Parameters<typeof toDailyRecord>[1]),
    );

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOne(tenantId: string, id: string, branchId?: string) {
    const log = await this.attendanceRepository.findById(
      id,
      new Types.ObjectId(tenantId),
    );
    if (!log) throw new NotFoundException('Attendance log not found');
    if (branchId && log.branchId?.toString() !== branchId) {
      throw new NotFoundException('Attendance log not found');
    }
    return log;
  }

  async manualAdjust(
    tenantId: string,
    id: string,
    actorId: string,
    dto: AdjustAttendanceDto,
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.attendanceRepository.findById(
      id,
      tenantObjectId,
    );
    if (!existing) throw new NotFoundException('Attendance log not found');

    const updateData: Record<string, unknown> = {
      status: 'MANUAL_ADJUSTED',
      adjustedBy: new Types.ObjectId(actorId),
      adjustReason: dto.reason,
    };
    if (dto.type) updateData.type = dto.type;
    if (dto.checkTime) updateData.checkTime = new Date(dto.checkTime);
    if (dto.note) updateData.note = dto.note;

    const updated = await this.attendanceRepository.updateLog(
      id,
      tenantObjectId,
      updateData,
    );

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole: 'HR_ADMIN',
      action: 'CREATE_MANUAL_ADJUSTMENT',
      module: 'attendance',
      targetId: new Types.ObjectId(id),
      before: {
        type: existing.type,
        checkTime: existing.checkTime,
        status: existing.status,
      },
      after: updateData,
    });

    return updated;
  }

  async getNotCheckedInReport(
    tenantId: string,
    query: AttendanceReportQueryDto,
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const date = query.date ? new Date(query.date) : new Date();
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    const branchObjectId = query.branchId
      ? new Types.ObjectId(query.branchId)
      : undefined;

    const [checkedInIds, activeEmployees] = await Promise.all([
      this.attendanceRepository.findCheckedInEmployeeIds(
        tenantObjectId,
        start,
        end,
      ),
      this.employeesRepository.findAllActive(tenantObjectId, branchObjectId),
    ]);

    const checkedInSet = new Set(checkedInIds);
    let notCheckedIn = activeEmployees.filter(
      (e) => !checkedInSet.has((e._id as Types.ObjectId).toString()),
    );

    if (notCheckedIn.length === 0) return [];

    const employeeObjectIds = notCheckedIn.map((e) => e._id as Types.ObjectId);
    const assignments =
      await this.shiftsRepository.findCurrentAssignmentsByEmployeeIds(
        employeeObjectIds,
        tenantObjectId,
      );
    const assignmentMap = new Map(
      assignments.map((a) => [a.employeeId.toString(), a]),
    );

    // Filter out employees whose shift does not include the query date's day of week
    const bangkokDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const queryDayOfWeek = bangkokDate.getUTCDay();

    notCheckedIn = notCheckedIn.filter((emp) => {
      const assignment = assignmentMap.get(
        (emp._id as Types.ObjectId).toString(),
      );
      if (!assignment) return true; // no shift assigned → always show
      const shift = assignment.shiftId as unknown as
        | { workDays?: number[] }
        | null
        | undefined;
      const workDays: number[] = shift?.workDays ?? [1, 2, 3, 4, 5];
      return workDays.includes(queryDayOfWeek);
    });

    const todayKey = toBangkokDateKey(new Date());
    const isToday = toBangkokDateKey(date) === todayKey;
    const nowMinutesBangkok = isToday
      ? getMinutesSinceMidnight(new Date())
      : null;

    return notCheckedIn
      .map((emp) =>
        this.toNotCheckedInItem(emp, assignmentMap, isToday, nowMinutesBangkok),
      )
      .filter((item) => item !== null);
  }

  private toNotCheckedInItem(
    emp: {
      _id: unknown;
      employeeCode?: string;
      firstName: string;
      lastName: string;
      positionId?: unknown;
      branchId?: unknown;
    },
    assignmentMap: Map<string, ShiftAssignmentDocument>,
    isToday: boolean,
    nowMinutesBangkok: number | null,
  ) {
    const empId = (emp._id as Types.ObjectId).toString();
    const assignment = assignmentMap.get(empId);
    const shift = assignment?.shiftId as unknown as
      | { startTime?: string }
      | null
      | undefined;
    const shiftStartTime = shift?.startTime ?? null;

    // For today: skip employees whose shift hasn't started yet
    if (isToday && shiftStartTime && nowMinutesBangkok !== null) {
      if (parseTimeToMinutes(shiftStartTime) > nowMinutesBangkok) return null;
    }

    const position = emp.positionId as
      | { _id: unknown; name: string }
      | null
      | undefined;
    const branch = emp.branchId as
      | { _id: unknown; name: string }
      | null
      | undefined;

    return {
      id: empId,
      employeeCode: emp.employeeCode ?? '',
      firstName: emp.firstName,
      lastName: emp.lastName,
      position: position
        ? {
            id: (position._id as Types.ObjectId).toString(),
            name: position.name,
          }
        : null,
      branch: branch
        ? { id: (branch._id as Types.ObjectId).toString(), name: branch.name }
        : null,
      shiftStartTime,
    };
  }

  async getSummary(tenantId: string, date: Date, branchId?: string) {
    const tenantObjId = new Types.ObjectId(tenantId);
    const branchObjectId = branchId ? new Types.ObjectId(branchId) : undefined;

    const [{ checkedIn, late }, total] = await Promise.all([
      this.attendanceRepository.getSummaryForDate(
        tenantObjId,
        date,
        branchObjectId,
      ),
      this.employeesRepository.countActive(tenantObjId, branchObjectId),
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

    const branchId = query.branchId
      ? new Types.ObjectId(query.branchId)
      : undefined;
    const logs = withoutSupersededLogs(
      await this.attendanceRepository.findByDateRange(
        tenantObjectId,
        start,
        end,
        branchId,
      ),
    );

    return this.populateEmployees(logs, tenantObjectId);
  }

  private async populateEmployees(
    logs: Array<{
      employeeId: Types.ObjectId;
      toObject?: () => Record<string, unknown>;
    }>,
    tenantId: Types.ObjectId,
  ) {
    if (logs.length === 0) return [];

    const uniqueEmpIds = [...new Set(logs.map((l) => l.employeeId.toString()))];
    const employees = await this.employeesRepository.findByIds(
      uniqueEmpIds,
      tenantId,
    );
    const empMap = new Map(
      employees.map((e) => [(e._id as Types.ObjectId).toString(), e]),
    );

    return logs.map((log) => ({
      ...(log.toObject ? log.toObject() : log),
      employee: empMap.get(log.employeeId.toString()) ?? null,
    }));
  }

  async getMonthlyReport(tenantId: string, query: AttendanceReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const year = parseInt(query.year ?? String(new Date().getFullYear()), 10);
    const month = parseInt(
      query.month ?? String(new Date().getMonth() + 1),
      10,
    );
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const branchId = query.branchId
      ? new Types.ObjectId(query.branchId)
      : undefined;
    const logs = await this.attendanceRepository.findByDateRange(
      tenantObjectId,
      start,
      end,
      branchId,
    );
    return withoutSupersededLogs(logs);
  }

  async getLateReport(tenantId: string, query: AttendanceReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const start = query.startDate ? new Date(query.startDate) : new Date();
    const end = query.endDate ? new Date(query.endDate) : new Date();
    const branchId = query.branchId
      ? new Types.ObjectId(query.branchId)
      : undefined;
    return this.attendanceRepository.findByStatus(
      tenantObjectId,
      'LATE',
      start,
      end,
      branchId,
    );
  }

  async getAbsentReport(tenantId: string, query: AttendanceReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const date = query.date ? new Date(query.date) : new Date();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const branchId = query.branchId
      ? new Types.ObjectId(query.branchId)
      : undefined;
    return this.attendanceRepository.findByStatus(
      tenantObjectId,
      'ABSENT',
      start,
      end,
      branchId,
    );
  }

  async getEmployeeMonthlyReport(
    tenantId: string,
    employeeId: string,
    year: number,
    month: number,
    scopeBranchId?: string,
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.employeesRepository.findById(employeeId, tenantObjectId);
    if (!employee) throw new NotFoundException('Employee not found');

    if (scopeBranchId && employee.branchId?.toString() !== scopeBranchId) {
      throw new NotFoundException('Employee not found');
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    const logs = await this.attendanceRepository.findLogsForEmployeeInMonth(
      tenantObjectId,
      employee._id as Types.ObjectId,
      start,
      end,
    );

    const logsByDate = this.groupLogsByDate(logs);
    const dailyRecords = this.buildDailyRecords(year, month, logsByDate);
    const summary = this.buildMonthlySummary(dailyRecords);

    return { employeeId, year, month, summary, dailyRecords };
  }

  private groupLogsByDate(
    logs: Array<{ type: string; checkTime: Date; status: string; lateMinutes: number; correctionFor?: Types.ObjectId; _id?: Types.ObjectId }>,
  ): Map<string, typeof logs> {
    const map = new Map<string, typeof logs>();
    for (const log of logs) {
      const dateKey = toBangkokDateKey(log.checkTime);
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(log);
    }
    return map;
  }

  private buildDailyRecords(
    year: number,
    month: number,
    logsByDate: Map<string, Array<{ type: string; checkTime: Date; status: string; lateMinutes: number }>>,
  ) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const records: Array<Record<string, unknown>> = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (isWeekend) {
        records.push({ date: dateKey, dayOfWeek, isWorkDay: false, checkIn: null, checkOut: null, dayStatus: 'WEEKEND' });
        continue;
      }

      const dayLogs = logsByDate.get(dateKey) ?? [];
      records.push(this.buildDayRecord(dateKey, dayOfWeek, dayLogs));
    }

    return records;
  }

  private buildDayRecord(
    dateKey: string,
    dayOfWeek: number,
    logs: Array<{ type: string; checkTime: Date; status: string; lateMinutes: number }>,
  ) {
    const checkInLog = logs.filter((l) => l.type === 'CHECK_IN').sort((a, b) => a.checkTime.getTime() - b.checkTime.getTime())[0] ?? null;
    const checkOutLog = logs.filter((l) => l.type === 'CHECK_OUT').sort((a, b) => b.checkTime.getTime() - a.checkTime.getTime())[0] ?? null;

    if (!checkInLog) {
      return { date: dateKey, dayOfWeek, isWorkDay: true, checkIn: null, checkOut: null, dayStatus: 'ABSENT' };
    }

    const toTimeString = (d: Date) => {
      const bangkokMs = d.getTime() + 7 * 60 * 60 * 1000;
      return new Date(bangkokMs).toISOString().slice(11, 16);
    };

    const lateMinutes = checkInLog.lateMinutes ?? 0;
    const isEarlyLeave = checkOutLog && (checkOutLog.status === 'EARLY_LEAVE');
    const dayStatus = isEarlyLeave ? 'EARLY_LEAVE' : lateMinutes > 0 ? 'LATE' : 'PRESENT';

    return {
      date: dateKey,
      dayOfWeek,
      isWorkDay: true,
      checkIn: { time: toTimeString(checkInLog.checkTime), status: checkInLog.status, lateMinutes },
      checkOut: checkOutLog ? { time: toTimeString(checkOutLog.checkTime), status: checkOutLog.status } : null,
      dayStatus,
    };
  }

  private buildMonthlySummary(dailyRecords: Array<Record<string, unknown>>) {
    const workDays = dailyRecords.filter((r) => r.isWorkDay);
    const totalWorkDays = workDays.length;
    const presentDays = workDays.filter((r) => r.dayStatus === 'PRESENT').length;
    const lateDays = workDays.filter((r) => r.dayStatus === 'LATE').length;
    const absentDays = workDays.filter((r) => r.dayStatus === 'ABSENT').length;
    const earlyLeaveDays = workDays.filter((r) => r.dayStatus === 'EARLY_LEAVE').length;
    const onTimeRate = totalWorkDays > 0 ? Math.round((presentDays / totalWorkDays) * 1000) / 10 : 0;

    return { totalWorkDays, presentDays, lateDays, absentDays, earlyLeaveDays, onTimeRate };
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
    const distance = this.geofenceService.calculateDistance(
      lat,
      lng,
      branchLat,
      branchLng,
    );
    const isInside = distance <= (branch.radiusMeters ?? 100);

    return { distance, isInside, branchId: employee.branchId };
  }

  private async calculateCheckInStatus(
    serverTime: Date,
    schedule: WorkSchedule | null,
  ): Promise<{ status: AttendanceStatus; lateMinutes: number }> {
    if (!schedule?.startTime) return { status: 'NORMAL', lateMinutes: 0 };

    const shiftStartMinutes = parseTimeToMinutes(schedule.startTime);
    const actualMinutes = getMinutesSinceMidnight(serverTime);
    const lateMinutes = Math.max(0, actualMinutes - shiftStartMinutes);
    const gracePeriod = schedule.gracePeriodMinutes;

    if (lateMinutes === 0) return { status: 'NORMAL', lateMinutes: 0 };
    if (lateMinutes <= gracePeriod)
      return { status: 'LATE_MINOR', lateMinutes };
    return { status: 'LATE', lateMinutes };
  }

  private guardWorkDay(schedule: WorkSchedule | null): void {
    if (!schedule) return;

    const bangkokDate = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const todayDow = bangkokDate.getUTCDay();

    if (!schedule.workDays.includes(todayDow)) {
      throw new BadRequestException('ບໍ່ໄດ້ທຳງານໃນມື້ນີ້ຕາມຕາຕະລາງກະ');
    }
  }

  private guardCheckInWindow(schedule: WorkSchedule | null): void {
    if (!schedule?.startTime) return;

    const shiftStartMinutes = parseTimeToMinutes(schedule.startTime);
    const windowOpenMinutes = shiftStartMinutes - 120;
    const nowMinutes = getMinutesSinceMidnight(new Date());

    if (nowMinutes < windowOpenMinutes) {
      const openHour = Math.floor(windowOpenMinutes / 60)
        .toString()
        .padStart(2, '0');
      const openMin = (windowOpenMinutes % 60).toString().padStart(2, '0');
      throw new BadRequestException(
        `ສາມາດ Check-in ໄດ້ຕັ້ງແຕ່ ${openHour}:${openMin}`,
      );
    }

    // Block check-in after shift end + 2-hour grace (prevents next-day or wrong-shift logins)
    if (schedule.endTime) {
      const shiftEndMinutes = parseTimeToMinutes(schedule.endTime);
      const windowCloseMinutes = shiftEndMinutes + 120;
      if (nowMinutes > windowCloseMinutes) {
        throw new BadRequestException(
          `ໝົດເວລາ Check-in ແລ້ວ (ກະສິ້ນສຸດ ${schedule.endTime})`,
        );
      }
    }
  }

  private guardCheckOutWindow(
    schedule: WorkSchedule | null,
    earlyLeaveReason?: string,
  ): void {
    if (!schedule?.endTime) return;

    const shiftEndMinutes = parseTimeToMinutes(schedule.endTime);
    const nowMinutes = getMinutesSinceMidnight(new Date());

    if (!schedule.isOvernight && nowMinutes < shiftEndMinutes) {
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
    serverTime: Date,
    schedule: WorkSchedule | null,
  ): Promise<AttendanceStatus> {
    if (!schedule?.endTime) return 'NORMAL';

    const shiftEndMinutes = parseTimeToMinutes(schedule.endTime);
    const checkOutMinutes = getMinutesSinceMidnight(serverTime);

    return checkOutMinutes < shiftEndMinutes ? 'EARLY_LEAVE' : 'NORMAL';
  }

  private async resolveWorkSchedule(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
    at: Date,
  ): Promise<WorkSchedule | null> {
    const policy = await this.companyPoliciesService.getEffectivePolicy(
      tenantId.toString(),
      at,
    );
    if (policy.workScheduleMode === 'UNIFORM') {
      const schedule = policy.uniformSchedule;
      return {
        source: 'UNIFORM',
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        workDays: schedule.workDays,
        gracePeriodMinutes: schedule.gracePeriodMinutes,
        isOvernight: schedule.isOvernight,
        policyId: 'id' in policy ? String(policy.id) : undefined,
      };
    }

    const assignment = await this.shiftsRepository.findCurrentAssignment(
      employeeId,
      tenantId,
    );
    const shift = assignment?.shiftId;
    if (
      !shift ||
      typeof shift !== 'object' ||
      (!('startTime' in shift) && !('endTime' in shift))
    )
      return null;
    const populated = shift as unknown as {
      _id?: Types.ObjectId;
      startTime?: string;
      endTime?: string;
      workDays?: number[];
      gracePeriodMinutes?: number;
      isOvernight?: boolean;
    };
    return {
      source: 'SHIFT',
      startTime: populated.startTime,
      endTime: populated.endTime,
      workDays: populated.workDays ?? [1, 2, 3, 4, 5],
      gracePeriodMinutes: populated.gracePeriodMinutes ?? 15,
      isOvernight: populated.isOvernight ?? false,
      shiftId: populated._id?.toString(),
    };
  }
}
