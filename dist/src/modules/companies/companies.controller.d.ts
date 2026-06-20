import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { CompanyQueryDto } from './dto/company-query.dto';
import { AssignPlanDto } from './dto/assign-plan.dto';
import { ExtendSubscriptionDto, UpdateSubscriptionDto } from './dto/update-subscription.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(dto: CreateCompanyDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    list(query: CompanyQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getOne(id: string): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, dto: UpdateCompanyDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    activate(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    suspend(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    createOwner(id: string, dto: CreateOwnerDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    assignPlan(id: string, body: AssignPlanDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    updateSubscription(id: string, body: UpdateSubscriptionDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    extendSubscription(id: string, body: ExtendSubscriptionDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    getUsage(id: string): Promise<{
        data: {
            companyId: string;
            employees: number;
            branches: number;
            storageUsedGB: number;
            limits: {
                maxEmployees: number;
                maxBranches: number;
                maxStorageGB: number;
            } | null;
        };
    }>;
    getSuperDashboard(): Promise<{
        data: {
            total: number;
            active: number;
            trial: number;
            suspended: number;
        };
    }>;
}
