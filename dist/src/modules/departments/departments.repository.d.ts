import { Model, Types } from 'mongoose';
import { DepartmentDocument } from './schemas/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
interface PaginatedDepartments {
    departments: DepartmentDocument[];
    total: number;
}
export declare class DepartmentsRepository {
    private readonly departmentModel;
    constructor(departmentModel: Model<DepartmentDocument>);
    create(tenantId: Types.ObjectId, dto: CreateDepartmentDto): Promise<DepartmentDocument>;
    findById(id: string, tenantId: Types.ObjectId): Promise<DepartmentDocument | null>;
    findPaginated(tenantId: Types.ObjectId, page: number, limit: number, sort: string): Promise<PaginatedDepartments>;
    update(id: string, tenantId: Types.ObjectId, dto: UpdateDepartmentDto): Promise<DepartmentDocument | null>;
    softDelete(id: string, tenantId: Types.ObjectId): Promise<DepartmentDocument | null>;
}
export {};
