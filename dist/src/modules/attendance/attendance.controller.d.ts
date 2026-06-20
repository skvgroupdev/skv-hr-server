import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { AdjustAttendanceDto } from './dto/adjust-attendance.dto';
import { AttendanceHistoryQueryDto, AttendanceReportQueryDto, EmployeeMonthlyReportQueryDto } from './dto/attendance-query.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    checkIn(dto: CheckInDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | {
            blocked: boolean;
            distanceFromBranch: number;
            message: string;
        };
    }>;
    checkOut(dto: CheckOutDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getMyToday(user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getMyHistory(query: AttendanceHistoryQueryDto, user: JwtPayload): Promise<{
        data: import("./attendance.service").DailyRecord[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getDailyReport(query: AttendanceReportQueryDto, user: JwtPayload): Promise<{
        data: ({
            employee: (import("mongoose").Document<unknown, {}, import("../employees/schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("../employees/schemas/employee.schema").Employee & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            } & {
                id: string;
            }) | null;
        } | {
            employee: (import("mongoose").Document<unknown, {}, import("../employees/schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("../employees/schemas/employee.schema").Employee & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            } & {
                id: string;
            }) | null;
            employeeId: import("mongoose").Types.ObjectId;
            toObject?: () => Record<string, unknown>;
        })[];
    }>;
    getMonthlyReport(query: AttendanceReportQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getLateReport(query: AttendanceReportQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getAbsentReport(query: AttendanceReportQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getSummary(dateStr: string, user: JwtPayload): Promise<{
        data: {
            date: string;
            total: number;
            checkedIn: number;
            late: number;
            notCheckedIn: number;
        };
    }>;
    getNotCheckedIn(query: AttendanceReportQueryDto, user: JwtPayload): Promise<{
        data: {
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
        }[];
    }>;
    getEmployeeMonthlyReport(employeeId: string, query: EmployeeMonthlyReportQueryDto, user: JwtPayload): Promise<{
        data: {
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
        };
    }>;
    getOne(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    adjust(id: string, dto: AdjustAttendanceDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
}
