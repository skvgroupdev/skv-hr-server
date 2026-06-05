import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

interface PaginatedDepartments {
  departments: DepartmentDocument[];
  total: number;
}

@Injectable()
export class DepartmentsRepository {
  constructor(
    @InjectModel(Department.name) private readonly departmentModel: Model<DepartmentDocument>,
  ) {}

  async create(tenantId: Types.ObjectId, dto: CreateDepartmentDto): Promise<DepartmentDocument> {
    return this.departmentModel.create({
      ...dto,
      tenantId,
      headId: dto.headId ? new Types.ObjectId(dto.headId) : null,
    });
  }

  async findById(id: string, tenantId: Types.ObjectId): Promise<DepartmentDocument | null> {
    return this.departmentModel.findOne({ _id: id, tenantId }).exec();
  }

  async findPaginated(
    tenantId: Types.ObjectId,
    page: number,
    limit: number,
    sort: string,
  ): Promise<PaginatedDepartments> {
    const skip = (page - 1) * limit;
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    const sortField = sort.replace(/^-/, '');
    const query = { tenantId };

    const [departments, total] = await Promise.all([
      this.departmentModel.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).exec(),
      this.departmentModel.countDocuments(query).exec(),
    ]);

    return { departments, total };
  }

  async update(
    id: string,
    tenantId: Types.ObjectId,
    dto: UpdateDepartmentDto,
  ): Promise<DepartmentDocument | null> {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.headId) updateData.headId = new Types.ObjectId(dto.headId);
    return this.departmentModel
      .findOneAndUpdate({ _id: id, tenantId }, updateData, { returnDocument: 'after' })
      .exec();
  }

  async softDelete(id: string, tenantId: Types.ObjectId): Promise<DepartmentDocument | null> {
    return this.departmentModel
      .findOneAndUpdate({ _id: id, tenantId }, { isActive: false }, { returnDocument: 'after' })
      .exec();
  }
}
