import { TaxConfigsService } from './tax-configs.service';
import { CreateTaxConfigDto } from './dto/create-tax-config.dto';
import { UpsertCompanyTaxConfigDto } from './dto/upsert-company-tax-config.dto';
interface JwtUser {
    sub: string;
    role: string;
    companyId: string | null;
}
export declare class TaxConfigsController {
    private readonly taxConfigsService;
    constructor(taxConfigsService: TaxConfigsService);
    create(dto: CreateTaxConfigDto): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/tax-config.schema").TaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/tax-config.schema").TaxConfig & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/tax-config.schema").TaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/tax-config.schema").TaxConfig & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findCurrent(): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/tax-config.schema").TaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/tax-config.schema").TaxConfig & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, dto: Partial<CreateTaxConfigDto>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/tax-config.schema").TaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/tax-config.schema").TaxConfig & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    getCompanyConfig(user: JwtUser): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/company-tax-config.schema").CompanyTaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company-tax-config.schema").CompanyTaxConfig & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    upsertCompanyConfig(user: JwtUser, dto: UpsertCompanyTaxConfigDto): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/company-tax-config.schema").CompanyTaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company-tax-config.schema").CompanyTaxConfig & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getAllCompanyConfigs(): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/company-tax-config.schema").CompanyTaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company-tax-config.schema").CompanyTaxConfig & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    upsertCompanyConfigByAdmin(tenantId: string, dto: UpsertCompanyTaxConfigDto, user: JwtUser): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/company-tax-config.schema").CompanyTaxConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company-tax-config.schema").CompanyTaxConfig & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
export {};
