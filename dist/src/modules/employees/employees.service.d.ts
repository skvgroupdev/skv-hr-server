import { Types } from 'mongoose';
import { EmployeesRepository } from './employees.repository';
import { UsersRepository } from '../users/users.repository';
import { CompaniesRepository } from '../companies/companies.repository';
import { PlansRepository } from '../plans/plans.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { DocumentsService } from '../documents/documents.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class EmployeesService {
    private readonly employeesRepository;
    private readonly usersRepository;
    private readonly companiesRepository;
    private readonly plansRepository;
    private readonly auditLogService;
    private readonly documentsService;
    constructor(employeesRepository: EmployeesRepository, usersRepository: UsersRepository, companiesRepository: CompaniesRepository, plansRepository: PlansRepository, auditLogService: AuditLogService, documentsService: DocumentsService);
    create(currentUser: JwtPayload, dto: CreateEmployeeDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/employee.schema").Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    private resolveEmployeeCode;
    list(currentUser: JwtPayload, query: EmployeeQueryDto): Promise<{
        data: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getOne(currentUser: JwtPayload, id: string): Promise<Record<string, unknown>>;
    update(currentUser: JwtPayload, id: string, dto: UpdateEmployeeDto): Promise<Record<string, unknown> | null>;
    deactivate(currentUser: JwtPayload, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/employee.schema").Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    reactivate(currentUser: JwtPayload, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/employee.schema").Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    uploadDocument(currentUser: JwtPayload, id: string, dto: UploadDocumentDto): Promise<import("mongoose").Document<unknown, {}, import("../documents/schemas/document.schema").DocumentRecord, {}, import("mongoose").DefaultSchemaOptions> & import("../documents/schemas/document.schema").DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    changeRole(currentUser: JwtPayload, employeeId: string, newRole: string): Promise<{
        message: string;
        role: string;
    }>;
    updateMyProfile(currentUser: JwtPayload, dto: UpdateMyProfileDto): Promise<Record<string, unknown>>;
    getDocuments(currentUser: JwtPayload, id: string): Promise<(import("mongoose").Document<unknown, {}, import("../documents/schemas/document.schema").DocumentRecord, {}, import("mongoose").DefaultSchemaOptions> & import("../documents/schemas/document.schema").DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
