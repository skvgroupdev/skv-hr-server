import { Model, Types } from 'mongoose';
import { BranchDocument } from './schemas/branch.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
interface PaginatedBranches {
    branches: BranchDocument[];
    total: number;
}
interface BranchFilter {
    tenantId: Types.ObjectId;
    isActive?: boolean;
}
export declare class BranchesRepository {
    private readonly branchModel;
    constructor(branchModel: Model<BranchDocument>);
    create(tenantId: Types.ObjectId, dto: CreateBranchDto): Promise<BranchDocument>;
    findById(id: string, tenantId: Types.ObjectId): Promise<BranchDocument | null>;
    findPaginated(tenantId: Types.ObjectId, page: number, limit: number, sort: string, filter?: Partial<BranchFilter>): Promise<PaginatedBranches>;
    update(id: string, tenantId: Types.ObjectId, dto: UpdateBranchDto): Promise<BranchDocument | null>;
    setActive(id: string, tenantId: Types.ObjectId, isActive: boolean): Promise<BranchDocument | null>;
    countByTenant(tenantId: Types.ObjectId): Promise<number>;
}
export {};
