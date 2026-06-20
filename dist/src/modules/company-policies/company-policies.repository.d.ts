import { Model, Types } from 'mongoose';
import { CompanyPolicy, CompanyPolicyDocument } from './schemas/company-policy.schema';
export declare class CompanyPoliciesRepository {
    private readonly model;
    constructor(model: Model<CompanyPolicyDocument>);
    findEffectiveAt(tenantId: Types.ObjectId, at: Date): Promise<CompanyPolicyDocument | null>;
    findLatest(tenantId: Types.ObjectId): Promise<CompanyPolicyDocument | null>;
    create(data: Partial<CompanyPolicy>): Promise<CompanyPolicyDocument>;
}
