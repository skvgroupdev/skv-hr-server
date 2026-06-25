import { Model, Types } from 'mongoose';
import { AttendanceAdjustment, AttendanceAdjustmentDocument } from './schemas/attendance-adjustment.schema';
export declare class AttendanceAdjustmentsRepository {
    private readonly model;
    constructor(model: Model<AttendanceAdjustmentDocument>);
    create(data: Partial<AttendanceAdjustment>): Promise<AttendanceAdjustmentDocument>;
    findById(id: string, tenantId: Types.ObjectId): Promise<AttendanceAdjustmentDocument | null>;
    findByEmployee(tenantId: Types.ObjectId, employeeId: Types.ObjectId): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    findAll(tenantId: Types.ObjectId, branchId?: Types.ObjectId, status?: AttendanceAdjustment['status']): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    findTodayActive(tenantId: Types.ObjectId, date: Date): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    update(id: string, tenantId: Types.ObjectId, data: Partial<AttendanceAdjustment>): Promise<AttendanceAdjustmentDocument | null>;
}
