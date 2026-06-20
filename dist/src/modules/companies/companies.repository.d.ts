import { Model, Types } from 'mongoose';
import { CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { BranchDocument } from '../branches/schemas/branch.schema';
import { EmployeeDocument } from '../employees/schemas/employee.schema';
interface PaginatedResult {
    companies: CompanyDocument[];
    total: number;
}
export declare class CompaniesRepository {
    private readonly companyModel;
    private readonly branchModel;
    private readonly employeeModel;
    constructor(companyModel: Model<CompanyDocument>, branchModel: Model<BranchDocument>, employeeModel: Model<EmployeeDocument>);
    create(dto: CreateCompanyDto): Promise<CompanyDocument>;
    findById(id: string): Promise<CompanyDocument | null>;
    findByIdWithPlan(id: string): Promise<CompanyDocument | null>;
    findPaginated(page: number, limit: number, sort: string): Promise<PaginatedResult>;
    update(id: string, dto: UpdateCompanyDto): Promise<CompanyDocument | null>;
    updateStatus(id: string, status: string): Promise<CompanyDocument | null>;
    countActiveEmployees(companyId: Types.ObjectId): Promise<number>;
    countActiveBranches(companyId: Types.ObjectId): Promise<number>;
}
export {};
