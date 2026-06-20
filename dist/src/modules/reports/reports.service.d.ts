import { Types } from 'mongoose';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { LeaveRepository } from '../leave/leave.repository';
import { OTRepository } from '../ot/ot.repository';
import { ReportQueryDto } from './report-query.dto';
export declare class ReportsService {
    private readonly attendanceRepository;
    private readonly leaveRepository;
    private readonly otRepository;
    constructor(attendanceRepository: AttendanceRepository, leaveRepository: LeaveRepository, otRepository: OTRepository);
    getDailyAttendance(tenantId: string, query: ReportQueryDto): Promise<(import("mongoose").Document<unknown, {}, import("../attendance/schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("../attendance/schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getMonthlyAttendance(tenantId: string, query: ReportQueryDto): Promise<(import("mongoose").Document<unknown, {}, import("../attendance/schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("../attendance/schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getLateAttendance(tenantId: string, query: ReportQueryDto): Promise<(import("mongoose").Document<unknown, {}, import("../attendance/schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("../attendance/schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAbsentAttendance(tenantId: string, query: ReportQueryDto): Promise<(import("mongoose").Document<unknown, {}, import("../attendance/schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("../attendance/schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getMissingCheckout(tenantId: string, query: ReportQueryDto): Promise<(import("mongoose").Document<unknown, {}, import("../attendance/schemas/attendance-log.schema").AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & import("../attendance/schemas/attendance-log.schema").AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getLeaveSummary(tenantId: string, query: ReportQueryDto): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../leave/schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../leave/schemas/leave-request.schema").LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../leave/schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../leave/schemas/leave-request.schema").LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getLeaveBalance(tenantId: string, query: ReportQueryDto): Promise<{
        message: string;
        year: number;
    }>;
    getOTSummary(tenantId: string, query: ReportQueryDto): Promise<(import("mongoose").Document<unknown, {}, import("../ot/schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../ot/schemas/ot-request.schema").OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getOTCost(tenantId: string, query: ReportQueryDto): Promise<{
        requests: (import("mongoose").Document<unknown, {}, import("../ot/schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../ot/schemas/ot-request.schema").OTRequest & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        totalHours: number;
    }>;
}
