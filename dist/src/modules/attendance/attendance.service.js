"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const attendance_repository_1 = require("./attendance.repository");
const geofence_service_1 = require("./geofence.service");
const audit_log_service_1 = require("../audit-logs/audit-log.service");
const employees_repository_1 = require("../employees/employees.repository");
const branches_repository_1 = require("../branches/branches.repository");
const shifts_repository_1 = require("../shifts/shifts.repository");
const notifications_service_1 = require("../notifications/notifications.service");
const company_policies_service_1 = require("../company-policies/company-policies.service");
const MAX_LIMIT = 100;
const TIMEZONE = 'Asia/Bangkok';
function toBangkokDateKey(date) {
    const bangkokMs = date.getTime() + 7 * 60 * 60 * 1000;
    return new Date(bangkokMs).toISOString().slice(0, 10);
}
function toDailyRecord(dateKey, logs) {
    const effectiveLogs = withoutSupersededLogs(logs);
    const checkIns = effectiveLogs
        .filter((l) => l.type === 'CHECK_IN')
        .sort((a, b) => a.checkTime.getTime() - b.checkTime.getTime());
    const checkOuts = effectiveLogs
        .filter((l) => l.type === 'CHECK_OUT')
        .sort((a, b) => b.checkTime.getTime() - a.checkTime.getTime());
    const checkInLog = checkIns[0] ?? null;
    const checkOutLog = checkOuts[0] ?? null;
    const workDuration = checkInLog && checkOutLog
        ? Math.round((checkOutLog.checkTime.getTime() - checkInLog.checkTime.getTime()) /
            60000)
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
function withoutSupersededLogs(logs) {
    const supersededIds = new Set(logs
        .filter((log) => log.correctionFor)
        .map((log) => String(log.correctionFor)));
    return logs.filter((log) => !log._id || !supersededIds.has(String(log._id)));
}
function parseTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
function getMinutesSinceMidnight(date) {
    const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;
    const bangkokMs = date.getTime() + BANGKOK_OFFSET_MS;
    return Math.floor(bangkokMs / 60_000) % 1440;
}
let AttendanceService = class AttendanceService {
    attendanceRepository;
    geofenceService;
    auditLogService;
    employeesRepository;
    branchesRepository;
    shiftsRepository;
    notificationsService;
    companyPoliciesService;
    constructor(attendanceRepository, geofenceService, auditLogService, employeesRepository, branchesRepository, shiftsRepository, notificationsService, companyPoliciesService) {
        this.attendanceRepository = attendanceRepository;
        this.geofenceService = geofenceService;
        this.auditLogService = auditLogService;
        this.employeesRepository = employeesRepository;
        this.branchesRepository = branchesRepository;
        this.shiftsRepository = shiftsRepository;
        this.notificationsService = notificationsService;
        this.companyPoliciesService = companyPoliciesService;
    }
    async checkIn(tenantId, userId, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        const { distance, isInside, branchId } = await this.checkGeofence(employee, tenantObjectId, dto.lat, dto.lng);
        if (!isInside && !dto.isOffsite) {
            return {
                blocked: true,
                distanceFromBranch: distance,
                message: 'ອຍູ່ອອກວຽກນອກ',
            };
        }
        const existingCheckIn = await this.attendanceRepository.findTodayCheckIn(employee._id, tenantObjectId);
        if (existingCheckIn)
            throw new common_1.BadRequestException('ທ່ານ check in ແລ້ວ');
        const schedule = await this.resolveWorkSchedule(employee._id, tenantObjectId, new Date());
        this.guardWorkDay(schedule);
        this.guardCheckInWindow(schedule);
        const serverTime = new Date();
        const { status, lateMinutes } = await this.calculateCheckInStatus(serverTime, schedule);
        const log = await this.attendanceRepository.create({
            tenantId: tenantObjectId,
            employeeId: employee._id,
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
    async checkOut(tenantId, userId, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        const existingCheckIn = await this.attendanceRepository.findTodayCheckIn(employee._id, tenantObjectId);
        if (!existingCheckIn)
            throw new common_1.BadRequestException('ບໍ່ພົບການ check in');
        const schedule = await this.resolveWorkSchedule(employee._id, tenantObjectId, new Date());
        this.guardCheckOutWindow(schedule, dto.earlyLeaveReason);
        const { distance, isInside, branchId } = await this.checkGeofence(employee, tenantObjectId, dto.lat, dto.lng);
        const serverTime = new Date();
        const status = await this.calculateCheckOutStatus(serverTime, schedule);
        const log = await this.attendanceRepository.create({
            tenantId: tenantObjectId,
            employeeId: employee._id,
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
    async getMyToday(tenantId, userId) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        return this.attendanceRepository.findTodayLogs(employee._id, tenantObjectId);
    }
    async getMyHistory(tenantId, userId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const startDate = query.startDate ? new Date(query.startDate) : undefined;
        const endDate = query.endDate ? new Date(query.endDate) : undefined;
        const { days, total } = await this.attendanceRepository.findDailyPaginated(tenantObjectId, employee._id, page, limit, startDate, endDate);
        const data = days.map((day) => toDailyRecord(day._id, day.logs));
        return {
            data,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getOne(tenantId, id, branchId) {
        const log = await this.attendanceRepository.findById(id, new mongoose_1.Types.ObjectId(tenantId));
        if (!log)
            throw new common_1.NotFoundException('Attendance log not found');
        if (branchId && log.branchId?.toString() !== branchId) {
            throw new common_1.NotFoundException('Attendance log not found');
        }
        return log;
    }
    async manualAdjust(tenantId, id, actorId, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.attendanceRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Attendance log not found');
        const updateData = {
            status: 'MANUAL_ADJUSTED',
            adjustedBy: new mongoose_1.Types.ObjectId(actorId),
            adjustReason: dto.reason,
        };
        if (dto.type)
            updateData.type = dto.type;
        if (dto.checkTime)
            updateData.checkTime = new Date(dto.checkTime);
        if (dto.note)
            updateData.note = dto.note;
        const updated = await this.attendanceRepository.updateLog(id, tenantObjectId, updateData);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole: 'HR_ADMIN',
            action: 'CREATE_MANUAL_ADJUSTMENT',
            module: 'attendance',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: {
                type: existing.type,
                checkTime: existing.checkTime,
                status: existing.status,
            },
            after: updateData,
        });
        return updated;
    }
    async getNotCheckedInReport(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const date = query.date ? new Date(query.date) : new Date();
        const start = new Date(date);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setUTCHours(23, 59, 59, 999);
        const branchObjectId = query.branchId
            ? new mongoose_1.Types.ObjectId(query.branchId)
            : undefined;
        const [checkedInIds, activeEmployees] = await Promise.all([
            this.attendanceRepository.findCheckedInEmployeeIds(tenantObjectId, start, end),
            this.employeesRepository.findAllActive(tenantObjectId, branchObjectId),
        ]);
        const checkedInSet = new Set(checkedInIds);
        let notCheckedIn = activeEmployees.filter((e) => !checkedInSet.has(e._id.toString()));
        if (notCheckedIn.length === 0)
            return [];
        const employeeObjectIds = notCheckedIn.map((e) => e._id);
        const assignments = await this.shiftsRepository.findCurrentAssignmentsByEmployeeIds(employeeObjectIds, tenantObjectId);
        const assignmentMap = new Map(assignments.map((a) => [a.employeeId.toString(), a]));
        const bangkokDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        const queryDayOfWeek = bangkokDate.getUTCDay();
        notCheckedIn = notCheckedIn.filter((emp) => {
            const assignment = assignmentMap.get(emp._id.toString());
            if (!assignment)
                return true;
            const shift = assignment.shiftId;
            const workDays = shift?.workDays ?? [1, 2, 3, 4, 5];
            return workDays.includes(queryDayOfWeek);
        });
        const todayKey = toBangkokDateKey(new Date());
        const isToday = toBangkokDateKey(date) === todayKey;
        const nowMinutesBangkok = isToday
            ? getMinutesSinceMidnight(new Date())
            : null;
        return notCheckedIn
            .map((emp) => this.toNotCheckedInItem(emp, assignmentMap, isToday, nowMinutesBangkok))
            .filter((item) => item !== null);
    }
    toNotCheckedInItem(emp, assignmentMap, isToday, nowMinutesBangkok) {
        const empId = emp._id.toString();
        const assignment = assignmentMap.get(empId);
        const shift = assignment?.shiftId;
        const shiftStartTime = shift?.startTime ?? null;
        if (isToday && shiftStartTime && nowMinutesBangkok !== null) {
            if (parseTimeToMinutes(shiftStartTime) > nowMinutesBangkok)
                return null;
        }
        const position = emp.positionId;
        const branch = emp.branchId;
        return {
            id: empId,
            employeeCode: emp.employeeCode ?? '',
            firstName: emp.firstName,
            lastName: emp.lastName,
            position: position
                ? {
                    id: position._id.toString(),
                    name: position.name,
                }
                : null,
            branch: branch
                ? { id: branch._id.toString(), name: branch.name }
                : null,
            shiftStartTime,
        };
    }
    async getSummary(tenantId, date, branchId) {
        const tenantObjId = new mongoose_1.Types.ObjectId(tenantId);
        const branchObjectId = branchId ? new mongoose_1.Types.ObjectId(branchId) : undefined;
        const [{ checkedIn, late }, total] = await Promise.all([
            this.attendanceRepository.getSummaryForDate(tenantObjId, date, branchObjectId),
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
    async getDailyReport(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const date = query.date ? new Date(query.date) : new Date();
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const branchId = query.branchId
            ? new mongoose_1.Types.ObjectId(query.branchId)
            : undefined;
        const logs = withoutSupersededLogs(await this.attendanceRepository.findByDateRange(tenantObjectId, start, end, branchId));
        return this.populateEmployees(logs, tenantObjectId);
    }
    async populateEmployees(logs, tenantId) {
        if (logs.length === 0)
            return [];
        const uniqueEmpIds = [...new Set(logs.map((l) => l.employeeId.toString()))];
        const employees = await this.employeesRepository.findByIds(uniqueEmpIds, tenantId);
        const empMap = new Map(employees.map((e) => [e._id.toString(), e]));
        return logs.map((log) => ({
            ...(log.toObject ? log.toObject() : log),
            employee: empMap.get(log.employeeId.toString()) ?? null,
        }));
    }
    async getMonthlyReport(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const year = parseInt(query.year ?? String(new Date().getFullYear()), 10);
        const month = parseInt(query.month ?? String(new Date().getMonth() + 1), 10);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);
        const branchId = query.branchId
            ? new mongoose_1.Types.ObjectId(query.branchId)
            : undefined;
        const logs = await this.attendanceRepository.findByDateRange(tenantObjectId, start, end, branchId);
        return withoutSupersededLogs(logs);
    }
    async getLateReport(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const start = query.startDate ? new Date(query.startDate) : new Date();
        const end = query.endDate ? new Date(query.endDate) : new Date();
        const branchId = query.branchId
            ? new mongoose_1.Types.ObjectId(query.branchId)
            : undefined;
        return this.attendanceRepository.findByStatus(tenantObjectId, 'LATE', start, end, branchId);
    }
    async getAbsentReport(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const date = query.date ? new Date(query.date) : new Date();
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const branchId = query.branchId
            ? new mongoose_1.Types.ObjectId(query.branchId)
            : undefined;
        return this.attendanceRepository.findByStatus(tenantObjectId, 'ABSENT', start, end, branchId);
    }
    async getEmployeeMonthlyReport(tenantId, employeeId, year, month, scopeBranchId) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.employeesRepository.findById(employeeId, tenantObjectId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        if (scopeBranchId && employee.branchId?.toString() !== scopeBranchId) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);
        const logs = await this.attendanceRepository.findLogsForEmployeeInMonth(tenantObjectId, employee._id, start, end);
        const logsByDate = this.groupLogsByDate(logs);
        const dailyRecords = this.buildDailyRecords(year, month, logsByDate);
        const summary = this.buildMonthlySummary(dailyRecords);
        return { employeeId, year, month, summary, dailyRecords };
    }
    groupLogsByDate(logs) {
        const map = new Map();
        for (const log of logs) {
            const dateKey = toBangkokDateKey(log.checkTime);
            if (!map.has(dateKey))
                map.set(dateKey, []);
            map.get(dateKey).push(log);
        }
        return map;
    }
    buildDailyRecords(year, month, logsByDate) {
        const daysInMonth = new Date(year, month, 0).getDate();
        const records = [];
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
    buildDayRecord(dateKey, dayOfWeek, logs) {
        const checkInLog = logs.filter((l) => l.type === 'CHECK_IN').sort((a, b) => a.checkTime.getTime() - b.checkTime.getTime())[0] ?? null;
        const checkOutLog = logs.filter((l) => l.type === 'CHECK_OUT').sort((a, b) => b.checkTime.getTime() - a.checkTime.getTime())[0] ?? null;
        if (!checkInLog) {
            return { date: dateKey, dayOfWeek, isWorkDay: true, checkIn: null, checkOut: null, dayStatus: 'ABSENT' };
        }
        const toTimeString = (d) => {
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
    buildMonthlySummary(dailyRecords) {
        const workDays = dailyRecords.filter((r) => r.isWorkDay);
        const totalWorkDays = workDays.length;
        const presentDays = workDays.filter((r) => r.dayStatus === 'PRESENT').length;
        const lateDays = workDays.filter((r) => r.dayStatus === 'LATE').length;
        const absentDays = workDays.filter((r) => r.dayStatus === 'ABSENT').length;
        const earlyLeaveDays = workDays.filter((r) => r.dayStatus === 'EARLY_LEAVE').length;
        const onTimeRate = totalWorkDays > 0 ? Math.round((presentDays / totalWorkDays) * 1000) / 10 : 0;
        return { totalWorkDays, presentDays, lateDays, absentDays, earlyLeaveDays, onTimeRate };
    }
    async findEmployeeByUserId(userId, tenantId) {
        const employee = await this.employeesRepository.findByUserIdAndTenant(new mongoose_1.Types.ObjectId(userId), tenantId);
        if (!employee)
            throw new common_1.NotFoundException('Employee profile not found');
        return employee;
    }
    async checkGeofence(employee, tenantId, lat, lng) {
        if (!employee.branchId) {
            return { distance: 0, isInside: true, branchId: null };
        }
        const branch = await this.branchesRepository.findById(employee.branchId.toString(), tenantId);
        if (!branch?.location?.coordinates) {
            return { distance: 0, isInside: true, branchId: employee.branchId };
        }
        const [branchLng, branchLat] = branch.location.coordinates;
        const distance = this.geofenceService.calculateDistance(lat, lng, branchLat, branchLng);
        const isInside = distance <= (branch.radiusMeters ?? 100);
        return { distance, isInside, branchId: employee.branchId };
    }
    async calculateCheckInStatus(serverTime, schedule) {
        if (!schedule?.startTime)
            return { status: 'NORMAL', lateMinutes: 0 };
        const shiftStartMinutes = parseTimeToMinutes(schedule.startTime);
        const actualMinutes = getMinutesSinceMidnight(serverTime);
        const lateMinutes = Math.max(0, actualMinutes - shiftStartMinutes);
        const gracePeriod = schedule.gracePeriodMinutes;
        if (lateMinutes === 0)
            return { status: 'NORMAL', lateMinutes: 0 };
        if (lateMinutes <= gracePeriod)
            return { status: 'LATE_MINOR', lateMinutes };
        return { status: 'LATE', lateMinutes };
    }
    guardWorkDay(schedule) {
        if (!schedule)
            return;
        const bangkokDate = new Date(Date.now() + 7 * 60 * 60 * 1000);
        const todayDow = bangkokDate.getUTCDay();
        if (!schedule.workDays.includes(todayDow)) {
            throw new common_1.BadRequestException('ບໍ່ໄດ້ທຳງານໃນມື້ນີ້ຕາມຕາຕະລາງກະ');
        }
    }
    guardCheckInWindow(schedule) {
        if (!schedule?.startTime)
            return;
        const shiftStartMinutes = parseTimeToMinutes(schedule.startTime);
        const windowOpenMinutes = shiftStartMinutes - 120;
        const nowMinutes = getMinutesSinceMidnight(new Date());
        if (nowMinutes < windowOpenMinutes) {
            const openHour = Math.floor(windowOpenMinutes / 60)
                .toString()
                .padStart(2, '0');
            const openMin = (windowOpenMinutes % 60).toString().padStart(2, '0');
            throw new common_1.BadRequestException(`ສາມາດ Check-in ໄດ້ຕັ້ງແຕ່ ${openHour}:${openMin}`);
        }
        if (schedule.endTime) {
            const shiftEndMinutes = parseTimeToMinutes(schedule.endTime);
            const windowCloseMinutes = shiftEndMinutes + 120;
            if (nowMinutes > windowCloseMinutes) {
                throw new common_1.BadRequestException(`ໝົດເວລາ Check-in ແລ້ວ (ກະສິ້ນສຸດ ${schedule.endTime})`);
            }
        }
    }
    guardCheckOutWindow(schedule, earlyLeaveReason) {
        if (!schedule?.endTime)
            return;
        const shiftEndMinutes = parseTimeToMinutes(schedule.endTime);
        const nowMinutes = getMinutesSinceMidnight(new Date());
        if (!schedule.isOvernight && nowMinutes < shiftEndMinutes) {
            if (!earlyLeaveReason) {
                throw new common_1.BadRequestException('ກະລຸນາລະບຸເຫດຜົນການອອກກ່ອນເວລາ');
            }
        }
    }
    async sendCheckInNotification(employee, tenantId, checkTime, status) {
        if (!employee.userId)
            return;
        const statusLabel = {
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
    async calculateCheckOutStatus(serverTime, schedule) {
        if (!schedule?.endTime)
            return 'NORMAL';
        const shiftEndMinutes = parseTimeToMinutes(schedule.endTime);
        const checkOutMinutes = getMinutesSinceMidnight(serverTime);
        return checkOutMinutes < shiftEndMinutes ? 'EARLY_LEAVE' : 'NORMAL';
    }
    async resolveWorkSchedule(employeeId, tenantId, at) {
        const policy = await this.companyPoliciesService.getEffectivePolicy(tenantId.toString(), at);
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
        const assignment = await this.shiftsRepository.findCurrentAssignment(employeeId, tenantId);
        const shift = assignment?.shiftId;
        if (!shift ||
            typeof shift !== 'object' ||
            (!('startTime' in shift) && !('endTime' in shift)))
            return null;
        const populated = shift;
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
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendance_repository_1.AttendanceRepository,
        geofence_service_1.GeofenceService,
        audit_log_service_1.AuditLogService,
        employees_repository_1.EmployeesRepository,
        branches_repository_1.BranchesRepository,
        shifts_repository_1.ShiftsRepository,
        notifications_service_1.NotificationsService,
        company_policies_service_1.CompanyPoliciesService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map