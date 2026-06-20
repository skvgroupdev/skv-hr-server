import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
declare class ChangeRoleDto {
    role: 'HR_ADMIN' | 'BRANCH_MANAGER' | 'SUPERVISOR' | 'STAFF';
}
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(dto: CreateEmployeeDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/employee.schema").Employee & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    list(query: EmployeeQueryDto, user: JwtPayload): Promise<{
        data: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getOne(id: string, user: JwtPayload): Promise<{
        data: Record<string, unknown>;
    }>;
    updateMyProfile(dto: UpdateMyProfileDto, user: JwtPayload): Promise<{
        data: Record<string, unknown>;
    }>;
    update(id: string, dto: UpdateEmployeeDto, user: JwtPayload): Promise<{
        data: Record<string, unknown> | null;
    }>;
    changeRole(user: JwtPayload, id: string, dto: ChangeRoleDto): Promise<{
        message: string;
        role: string;
    }>;
    deactivate(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/employee.schema").Employee & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    reactivate(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/employee.schema").Employee & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    uploadDocument(id: string, dto: UploadDocumentDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("../documents/schemas/document.schema").DocumentRecord, {}, import("mongoose").DefaultSchemaOptions> & import("../documents/schemas/document.schema").DocumentRecord & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getDocuments(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../documents/schemas/document.schema").DocumentRecord, {}, import("mongoose").DefaultSchemaOptions> & import("../documents/schemas/document.schema").DocumentRecord & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
}
export {};
