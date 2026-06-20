import { Types } from 'mongoose';
import { BranchesRepository } from './branches.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchQueryDto } from './dto/branch-query.dto';
import { EmployeesRepository } from '../employees/employees.repository';
import { UsersRepository } from '../users/users.repository';
import { CompaniesRepository } from '../companies/companies.repository';
import { PlansRepository } from '../plans/plans.repository';
export declare class BranchesService {
    private readonly branchesRepository;
    private readonly auditLogService;
    private readonly employeesRepository;
    private readonly usersRepository;
    private readonly companiesRepository;
    private readonly plansRepository;
    constructor(branchesRepository: BranchesRepository, auditLogService: AuditLogService, employeesRepository: EmployeesRepository, usersRepository: UsersRepository, companiesRepository: CompaniesRepository, plansRepository: PlansRepository);
    create(tenantId: string, dto: CreateBranchDto, actorId: string, actorRole: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    list(tenantId: string, query: BranchQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
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
    getOne(tenantId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenantId: string, id: string, dto: UpdateBranchDto, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    softDelete(tenantId: string, id: string, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    activate(tenantId: string, id: string, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deactivate(tenantId: string, id: string, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    assignManager(tenantId: string, branchId: string, employeeId: string, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
