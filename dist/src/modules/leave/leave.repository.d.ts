import { Model, Types } from 'mongoose';
import { LeaveType, LeaveTypeDocument } from './schemas/leave-type.schema';
import { LeaveBalance, LeaveBalanceDocument } from './schemas/leave-balance.schema';
import { LeaveRequest, LeaveRequestDocument } from './schemas/leave-request.schema';
export declare class LeaveRepository {
    private readonly leaveTypeModel;
    private readonly balanceModel;
    private readonly requestModel;
    constructor(leaveTypeModel: Model<LeaveTypeDocument>, balanceModel: Model<LeaveBalanceDocument>, requestModel: Model<LeaveRequestDocument>);
    createLeaveType(data: Partial<LeaveType>): Promise<LeaveTypeDocument>;
    findAllLeaveTypes(tenantId: Types.ObjectId): Promise<LeaveTypeDocument[]>;
    findLeaveTypeById(id: string, tenantId: Types.ObjectId): Promise<LeaveTypeDocument | null>;
    updateLeaveType(id: string, tenantId: Types.ObjectId, data: Partial<LeaveType>): Promise<LeaveTypeDocument | null>;
    softDeleteLeaveType(id: string, tenantId: Types.ObjectId): Promise<LeaveTypeDocument | null>;
    findBalance(tenantId: Types.ObjectId, employeeId: Types.ObjectId, leaveTypeId: Types.ObjectId, year: number): Promise<LeaveBalanceDocument | null>;
    findBalancesByEmployee(tenantId: Types.ObjectId, employeeId: Types.ObjectId): Promise<LeaveBalanceDocument[]>;
    upsertBalance(tenantId: Types.ObjectId, employeeId: Types.ObjectId, leaveTypeId: Types.ObjectId, year: number, adjustUsed: number): Promise<LeaveBalanceDocument>;
    createBalance(data: Partial<LeaveBalance>): Promise<LeaveBalanceDocument>;
    adjustBalance(tenantId: Types.ObjectId, employeeId: Types.ObjectId, leaveTypeId: Types.ObjectId, year: number, adjustment: number): Promise<LeaveBalanceDocument | null>;
    createRequest(data: Partial<LeaveRequest>): Promise<LeaveRequestDocument>;
    findRequestById(id: string, tenantId: Types.ObjectId): Promise<LeaveRequestDocument | null>;
    findRequestsByEmployee(tenantId: Types.ObjectId, employeeId: Types.ObjectId, page: number, limit: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & LeaveRequest & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & LeaveRequest & {
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
    findPendingRequests(tenantId: Types.ObjectId): Promise<LeaveRequestDocument[]>;
    updateRequest(id: string, tenantId: Types.ObjectId, data: Partial<LeaveRequest>): Promise<LeaveRequestDocument | null>;
    findOverlapping(tenantId: Types.ObjectId, employeeId: Types.ObjectId, startDate: Date, endDate: Date): Promise<LeaveRequestDocument | null>;
    findTodayActive(tenantId: Types.ObjectId, date: Date): Promise<LeaveRequestDocument[]>;
    findReport(tenantId: Types.ObjectId, filter: Record<string, unknown>, page: number, limit: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & LeaveRequest & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & LeaveRequest & {
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
    findApprovedInDateRange(tenantId: Types.ObjectId, startDate: Date, endDate: Date): Promise<{
        employeeId: Types.ObjectId;
        totalDays: number;
        category: 'LEAVE' | 'REST_DAY';
        isPaid: boolean;
    }[]>;
}
