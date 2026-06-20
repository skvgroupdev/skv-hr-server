import { Model, Types } from 'mongoose';
import { OutsideWork, OutsideWorkDocument } from './schemas/outside-work.schema';
export declare class OutsideWorkRepository {
    private readonly model;
    constructor(model: Model<OutsideWorkDocument>);
    create(data: Partial<OutsideWork>): Promise<OutsideWorkDocument>;
    findById(id: string, tenantId: Types.ObjectId): Promise<OutsideWorkDocument | null>;
    findByEmployee(tenantId: Types.ObjectId, employeeId: Types.ObjectId, page: number, limit: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & OutsideWork & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & OutsideWork & {
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
    findPending(tenantId: Types.ObjectId): Promise<OutsideWorkDocument[]>;
    update(id: string, tenantId: Types.ObjectId, update: Partial<OutsideWork>): Promise<OutsideWorkDocument | null>;
    findReport(tenantId: Types.ObjectId, filter: Record<string, unknown>, page: number, limit: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & OutsideWork & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & OutsideWork & {
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
}
