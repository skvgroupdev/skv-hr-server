import { Model, Types } from 'mongoose';
import { OTPolicy, OTPolicyDocument } from './schemas/ot-policy.schema';
import { OTRequest, OTRequestDocument } from './schemas/ot-request.schema';
export declare class OTRepository {
    private readonly policyModel;
    private readonly requestModel;
    constructor(policyModel: Model<OTPolicyDocument>, requestModel: Model<OTRequestDocument>);
    getPolicy(tenantId: Types.ObjectId): Promise<OTPolicyDocument | null>;
    upsertPolicy(tenantId: Types.ObjectId, data: Partial<OTPolicy>): Promise<OTPolicyDocument>;
    createRequest(data: Partial<OTRequest>): Promise<OTRequestDocument>;
    findById(id: string, tenantId: Types.ObjectId): Promise<OTRequestDocument | null>;
    findByEmployee(tenantId: Types.ObjectId, employeeId: Types.ObjectId, page: number, limit: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, OTRequest, {}, import("mongoose").DefaultSchemaOptions> & OTRequest & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, OTRequest, {}, import("mongoose").DefaultSchemaOptions> & OTRequest & {
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
    findPending(tenantId: Types.ObjectId): Promise<OTRequestDocument[]>;
    updateRequest(id: string, tenantId: Types.ObjectId, data: Partial<OTRequest>): Promise<OTRequestDocument | null>;
    findApprovedInDateRange(tenantId: Types.ObjectId, startDate: Date, endDate: Date, employeeId?: Types.ObjectId): Promise<OTRequestDocument[]>;
    findReport(tenantId: Types.ObjectId, filter: Record<string, unknown>, page: number, limit: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, OTRequest, {}, import("mongoose").DefaultSchemaOptions> & OTRequest & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, OTRequest, {}, import("mongoose").DefaultSchemaOptions> & OTRequest & {
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
