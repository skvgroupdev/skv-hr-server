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
import { NotificationsService } from '../notifications/notifications.service';
import { CompanyPoliciesService } from '../company-policies/company-policies.service';
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
export declare class AttendanceService {
    private readonly attendanceRepository;
    private readonly geofenceService;
    private readonly auditLogService;
    private readonly employeesRepository;
    private readonly branchesRepository;
    private readonly shiftsRepository;
    private readonly notificationsService;
    private readonly companyPoliciesService;
    constructor(attendanceRepository: AttendanceRepository, geofenceService: GeofenceService, auditLogService: AuditLogService, employeesRepository: EmployeesRepository, branchesRepository: BranchesRepository, shiftsRepository: ShiftsRepository, notificationsService: NotificationsService, companyPoliciesService: CompanyPoliciesService);
    checkIn(tenantId: string, userId: string, dto: CheckInDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | {
        blocked: boolean;
        distanceFromBranch: number;
        message: string;
    }>;
    checkOut(tenantId: string, userId: string, dto: CheckOutDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyToday(tenantId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getMyHistory(tenantId: string, userId: string, query: AttendanceHistoryQueryDto): Promise<{
        data: DailyRecord[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getOne(tenantId: string, id: string, branchId?: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    manualAdjust(tenantId: string, id: string, actorId: string, dto: AdjustAttendanceDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getNotCheckedInReport(tenantId: string, query: AttendanceReportQueryDto): Promise<{
        id: string;
        employeeCode: string;
        firstName: string;
        lastName: string;
        position: {
            id: string;
            name: string;
        } | null;
        branch: {
            id: string;
            name: string;
        } | null;
        shiftStartTime: string | null;
    }[]>;
    private toNotCheckedInItem;
    getSummary(tenantId: string, date: Date, branchId?: string): Promise<{
        date: string;
        total: number;
        checkedIn: number;
        late: number;
        notCheckedIn: number;
    }>;
    getDailyReport(tenantId: string, query: AttendanceReportQueryDto): Promise<({
        employee: (import("mongoose").Document<unknown, {}, import("../employees/schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("../employees/schemas/employee.schema").Employee & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    } | {
        employee: (import("mongoose").Document<unknown, {}, import("../employees/schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("../employees/schemas/employee.schema").Employee & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
        employeeId: Types.ObjectId;
        toObject?: () => Record<string, unknown>;
    })[]>;
    private populateEmployees;
    getMonthlyReport(tenantId: string, query: AttendanceReportQueryDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getLateReport(tenantId: string, query: AttendanceReportQueryDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAbsentReport(tenantId: string, query: AttendanceReportQueryDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getEmployeeMonthlyReport(tenantId: string, employeeId: string, year: number, month: number, scopeBranchId?: string): Promise<{
        employeeId: string;
        year: number;
        month: number;
        summary: {
            totalWorkDays: number;
            presentDays: number;
            lateDays: number;
            absentDays: number;
            earlyLeaveDays: number;
            onTimeRate: number;
        };
        dailyRecords: Record<string, unknown>[];
    }>;
    private groupLogsByDate;
    private buildDailyRecords;
    private buildDayRecord;
    private buildMonthlySummary;
    private findEmployeeByUserId;
    private checkGeofence;
    private calculateCheckInStatus;
    private guardWorkDay;
    private guardCheckInWindow;
    private guardCheckOutWindow;
    private sendCheckInNotification;
    private calculateCheckOutStatus;
    private resolveWorkSchedule;
}
