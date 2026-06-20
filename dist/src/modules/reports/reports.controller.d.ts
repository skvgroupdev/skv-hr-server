import { ReportsService } from './reports.service';
import { ReportQueryDto } from './report-query.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDailyAttendance(query: ReportQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../attendance/schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("../attendance/schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getMonthlyAttendance(query: ReportQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../attendance/schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("../attendance/schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getLateAttendance(query: ReportQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../attendance/schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("../attendance/schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getAbsentAttendance(query: ReportQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../attendance/schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("../attendance/schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getMissingCheckout(query: ReportQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../attendance/schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("../attendance/schemas/attendance-log.schema").AttendanceLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getLeaveSummary(query: ReportQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../leave/schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../leave/schemas/leave-request.schema").LeaveRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../leave/schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../leave/schemas/leave-request.schema").LeaveRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    getLeaveBalance(query: ReportQueryDto, user: JwtPayload): Promise<{
        data: {
            message: string;
            year: number;
        };
    }>;
    getOTSummary(query: ReportQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../ot/schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../ot/schemas/ot-request.schema").OTRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getOTCost(query: ReportQueryDto, user: JwtPayload): Promise<{
        data: {
            requests: (import("mongoose").Document<unknown, {}, import("../ot/schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../ot/schemas/ot-request.schema").OTRequest & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            } & {
                id: string;
            })[];
            totalHours: number;
        };
    }>;
}
