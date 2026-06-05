import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Branch, BranchDocument } from './schemas/branch.schema';
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

@Injectable()
export class BranchesRepository {
  constructor(@InjectModel(Branch.name) private readonly branchModel: Model<BranchDocument>) {}

  async create(tenantId: Types.ObjectId, dto: CreateBranchDto): Promise<BranchDocument> {
    const coords = dto.location?.coordinates;
    const location =
      Array.isArray(coords) && coords.length === 2
        ? { type: 'Point' as const, coordinates: coords }
        : undefined;

    return this.branchModel.create({
      ...dto,
      tenantId,
      location,
      managerId: dto.managerId ? new Types.ObjectId(dto.managerId) : null,
    });
  }

  async findById(id: string, tenantId: Types.ObjectId): Promise<BranchDocument | null> {
    return this.branchModel.findOne({ _id: id, tenantId }).exec();
  }

  async findPaginated(
    tenantId: Types.ObjectId,
    page: number,
    limit: number,
    sort: string,
    filter: Partial<BranchFilter> = {},
  ): Promise<PaginatedBranches> {
    const skip = (page - 1) * limit;
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    const sortField = sort.replace(/^-/, '');
    const query = { tenantId, ...filter };

    const [branches, total] = await Promise.all([
      this.branchModel.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).exec(),
      this.branchModel.countDocuments(query).exec(),
    ]);

    return { branches, total };
  }

  async update(id: string, tenantId: Types.ObjectId, dto: UpdateBranchDto): Promise<BranchDocument | null> {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.managerId) updateData.managerId = new Types.ObjectId(dto.managerId);

    if ('location' in dto) {
      const coords = dto.location?.coordinates;
      updateData.location =
        Array.isArray(coords) && coords.length === 2
          ? { type: 'Point', coordinates: coords }
          : undefined;
    }

    return this.branchModel.findOneAndUpdate({ _id: id, tenantId }, updateData, { returnDocument: 'after' }).exec();
  }

  async setActive(id: string, tenantId: Types.ObjectId, isActive: boolean): Promise<BranchDocument | null> {
    return this.branchModel.findOneAndUpdate({ _id: id, tenantId }, { isActive }, { returnDocument: 'after' }).exec();
  }

  async countByTenant(tenantId: Types.ObjectId): Promise<number> {
    return this.branchModel.countDocuments({ tenantId, isActive: true }).exec();
  }
}
