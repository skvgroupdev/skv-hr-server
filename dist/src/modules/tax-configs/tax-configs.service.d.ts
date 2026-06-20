import { TaxConfigsRepository } from './tax-configs.repository';
import { CompanyTaxConfigsRepository } from './company-tax-configs.repository';
import { CreateTaxConfigDto } from './dto/create-tax-config.dto';
import { UpsertCompanyTaxConfigDto } from './dto/upsert-company-tax-config.dto';
import { TaxMode } from './schemas/company-tax-config.schema';
export declare class TaxConfigsService {
    private readonly taxConfigsRepository;
    private readonly companyTaxConfigsRepository;
    constructor(taxConfigsRepository: TaxConfigsRepository, companyTaxConfigsRepository: CompanyTaxConfigsRepository);
    create(dto: CreateTaxConfigDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/tax-config.schema").TaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/tax-config.schema").TaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/tax-config.schema").TaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/tax-config.schema").TaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findCurrent(): Promise<import("mongoose").Document<unknown, {}, import("./schemas/tax-config.schema").TaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/tax-config.schema").TaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: Partial<CreateTaxConfigDto>): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/tax-config.schema").TaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/tax-config.schema").TaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    private getOrCreateGlobalConfig;
    getCompanyConfig(tenantId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/company-tax-config.schema").CompanyTaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company-tax-config.schema").CompanyTaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    upsertCompanyConfig(tenantId: string, dto: UpsertCompanyTaxConfigDto, updatedBy: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/company-tax-config.schema").CompanyTaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company-tax-config.schema").CompanyTaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllCompanyConfigs(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/company-tax-config.schema").CompanyTaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company-tax-config.schema").CompanyTaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    resolveEffectiveRates(taxMode: TaxMode, enableEmployeeSs: boolean, enableIncomeTax: boolean, baseEmployeeSsRate: number, baseEmployerSsRate: number): {
        effectiveEmployeeSsRate: number;
        effectiveEmployerSsRate: number;
        applyIncomeTax: boolean;
        taxOnCompany: boolean;
        noDeduction: boolean;
    };
}
