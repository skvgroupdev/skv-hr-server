import { Model, Types } from 'mongoose';
import { EmployeeDocument, EmployeeStatus } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
interface PaginatedEmployees {
    employees: EmployeeDocument[];
    total: number;
}
interface EmployeeListFilter {
    tenantId: Types.ObjectId;
    branchId?: Types.ObjectId;
    departmentId?: Types.ObjectId;
    status?: EmployeeStatus;
    $or?: Array<Record<string, unknown>>;
    $and?: Array<Record<string, unknown>>;
}
export declare class EmployeesRepository {
    private readonly employeeModel;
    constructor(employeeModel: Model<EmployeeDocument>);
    create(tenantId: Types.ObjectId, dto: CreateEmployeeDto): Promise<EmployeeDocument>;
    hardDelete(id: string, tenantId: Types.ObjectId): Promise<{
        deletedCount: number;
        userId: Types.ObjectId | null;
    }>;
    findById(id: string, tenantId: Types.ObjectId): Promise<EmployeeDocument | null>;
    findPaginated(filter: EmployeeListFilter, page: number, limit: number, sort: string): Promise<PaginatedEmployees>;
    update(id: string, tenantId: Types.ObjectId, dto: UpdateEmployeeDto): Promise<EmployeeDocument | null>;
    setStatus(id: string, tenantId: Types.ObjectId, status: EmployeeStatus): Promise<EmployeeDocument | null>;
    linkUser(id: string, tenantId: Types.ObjectId, userId: Types.ObjectId): Promise<void>;
    findByUserId(userId: Types.ObjectId): Promise<EmployeeDocument | null>;
    findFullByUserIdAndTenant(userId: Types.ObjectId, tenantId: Types.ObjectId): Promise<EmployeeDocument | null>;
    updateByUserIdAndTenant(userId: Types.ObjectId, tenantId: Types.ObjectId, data: Partial<Record<string, unknown>>): Promise<EmployeeDocument | null>;
    findByUserIdAndTenant(userId: Types.ObjectId, tenantId: Types.ObjectId): Promise<EmployeeDocument | null>;
    countByTenant(tenantId: Types.ObjectId): Promise<number>;
    countActive(tenantId: Types.ObjectId, branchId?: Types.ObjectId): Promise<number>;
    findByIds(ids: string[], tenantId: Types.ObjectId): Promise<EmployeeDocument[]>;
    findAllActive(tenantId: Types.ObjectId, branchId?: Types.ObjectId): Promise<EmployeeDocument[]>;
    generateNextCode(tenantId: Types.ObjectId, companyCode: string, year: number): Promise<string>;
    findByEmployeeCode(tenantId: Types.ObjectId, employeeCode: string): Promise<EmployeeDocument | null>;
}
export {};
