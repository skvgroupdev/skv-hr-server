import { Model } from 'mongoose';
import { CompanyTaxConfigDocument } from './schemas/company-tax-config.schema';
import { UpsertCompanyTaxConfigDto } from './dto/upsert-company-tax-config.dto';
export declare class CompanyTaxConfigsRepository {
    private readonly model;
    constructor(model: Model<CompanyTaxConfigDocument>);
    findByTenant(tenantId: string): Promise<CompanyTaxConfigDocument | null>;
    upsertByTenant(tenantId: string, dto: UpsertCompanyTaxConfigDto, updatedBy?: string): Promise<CompanyTaxConfigDocument>;
    createDefault(tenantId: string, taxConfigId: string): Promise<CompanyTaxConfigDocument>;
    findAll(): Promise<CompanyTaxConfigDocument[]>;
}
