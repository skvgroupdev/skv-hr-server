import { Model, Types } from 'mongoose';
import { AttendanceLog, AttendanceLogDocument, AttendanceStatus, AttendanceType } from './schemas/attendance-log.schema';
export declare class AttendanceRepository {
    private readonly logModel;
    constructor(logModel: Model<AttendanceLogDocument>);
    create(data: Partial<AttendanceLog>): Promise<AttendanceLogDocument>;
    findById(id: string, tenantId: Types.ObjectId): Promise<AttendanceLogDocument | null>;
    findTodayCheckIn(employeeId: Types.ObjectId, tenantId: Types.ObjectId): Promise<AttendanceLogDocument | null>;
    findTodayLogs(employeeId: Types.ObjectId, tenantId: Types.ObjectId): Promise<AttendanceLogDocument[]>;
    findPaginated(tenantId: Types.ObjectId, employeeId: Types.ObjectId, page: number, limit: number, startDate?: Date, endDate?: Date): Promise<{
        logs: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & AttendanceLog & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, AttendanceLog, {}, import("mongoose").DefaultSchemaOptions> & AttendanceLog & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        total: number;
    }>;
    findByDateRange(tenantId: Types.ObjectId, startDate: Date, endDate: Date, branchId?: Types.ObjectId): Promise<AttendanceLogDocument[]>;
    findByStatus(tenantId: Types.ObjectId, status: AttendanceStatus, startDate: Date, endDate: Date, branchId?: Types.ObjectId): Promise<AttendanceLogDocument[]>;
    updateLog(id: string, tenantId: Types.ObjectId, update: Partial<AttendanceLog>): Promise<AttendanceLogDocument | null>;
    updateStatus(id: string, status: AttendanceStatus): Promise<AttendanceLogDocument | null>;
    findDailyPaginated(tenantId: Types.ObjectId, employeeId: Types.ObjectId, page: number, limit: number, startDate?: Date, endDate?: Date): Promise<{
        days: {
            _id: string;
            logs: AttendanceLog[];
        }[];
        total: number;
    }>;
    findByType(tenantId: Types.ObjectId, type: AttendanceType, startDate: Date, endDate: Date, branchId?: Types.ObjectId): Promise<AttendanceLogDocument[]>;
    findCheckedInEmployeeIds(tenantId: Types.ObjectId, start: Date, end: Date): Promise<string[]>;
    getSummaryForDate(tenantId: Types.ObjectId, date: Date, branchId?: Types.ObjectId): Promise<{
        checkedIn: number;
        late: number;
    }>;
    findLogsForEmployeeInMonth(tenantId: Types.ObjectId, employeeId: Types.ObjectId, start: Date, end: Date): Promise<AttendanceLogDocument[]>;
    countPresenceDaysByEmployee(tenantId: Types.ObjectId, employeeIds: Types.ObjectId[], startDate: Date, endDate: Date): Promise<Map<string, number>>;
}
