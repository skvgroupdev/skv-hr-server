import { Types } from 'mongoose';
import { CompaniesRepository } from './companies.repository';
import { UsersRepository } from '../users/users.repository';
import { PlansRepository } from '../plans/plans.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { CompanyQueryDto } from './dto/company-query.dto';
import { ExtendSubscriptionDto, UpdateSubscriptionDto } from './dto/update-subscription.dto';
export declare class CompaniesService {
    private readonly companiesRepository;
    private readonly usersRepository;
    private readonly plansRepository;
    private readonly auditLogService;
    constructor(companiesRepository: CompaniesRepository, usersRepository: UsersRepository, plansRepository: PlansRepository, auditLogService: AuditLogService);
    createCompany(dto: CreateCompanyDto, actorId: string, actorRole: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    listCompanies(query: CompanyQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
            _id: Types.ObjectId;
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
    getCompany(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updateCompany(id: string, dto: UpdateCompanyDto, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    activateCompany(id: string, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    suspendCompany(id: string, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    assignPlan(companyId: string, planId: string, startDate: string, endDate: string, isPaid: boolean, actorId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updateSubscription(companyId: string, dto: UpdateSubscriptionDto, actorId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    extendSubscription(companyId: string, dto: ExtendSubscriptionDto, actorId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/company.schema").Company, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company.schema").Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getUsage(companyId: string): Promise<{
        companyId: string;
        employees: number;
        branches: number;
        storageUsedGB: number;
        limits: {
            maxEmployees: number;
            maxBranches: number;
            maxStorageGB: number;
        } | null;
    }>;
    getSuperDashboard(): Promise<{
        total: number;
        active: number;
        trial: number;
        suspended: number;
    }>;
    createOwner(companyId: string, dto: CreateOwnerDto, actorId: string, actorRole: string): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    private deriveCompanyCode;
    private assertObjectId;
    private parseDate;
    private mapSubscriptionToCompanyStatus;
}
