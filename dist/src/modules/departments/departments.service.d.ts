import { Types } from 'mongoose';
import { DepartmentsRepository } from './departments.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentQueryDto } from './dto/department-query.dto';
export declare class DepartmentsService {
    private readonly departmentsRepository;
    private readonly auditLogService;
    constructor(departmentsRepository: DepartmentsRepository, auditLogService: AuditLogService);
    create(tenantId: string, dto: CreateDepartmentDto, actorId: string, actorRole: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/department.schema").Department, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/department.schema").Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    list(tenantId: string, query: DepartmentQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/department.schema").Department, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/department.schema").Department & {
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
    getOne(tenantId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/department.schema").Department, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/department.schema").Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenantId: string, id: string, dto: UpdateDepartmentDto, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/department.schema").Department, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/department.schema").Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    softDelete(tenantId: string, id: string, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/department.schema").Department, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/department.schema").Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
