import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Employee,
  EmployeeDocument,
  EmployeeStatus,
} from './schemas/employee.schema';
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

@Injectable()
export class EmployeesRepository {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>,
  ) {}

  async create(
    tenantId: Types.ObjectId,
    dto: CreateEmployeeDto,
  ): Promise<EmployeeDocument> {
    const data: Record<string, unknown> = {
      ...dto,
      tenantId,
      branchId: dto.branchId ? new Types.ObjectId(dto.branchId) : null,
      departmentId: dto.departmentId
        ? new Types.ObjectId(dto.departmentId)
        : null,
      positionId: dto.positionId ? new Types.ObjectId(dto.positionId) : null,
      managerId: dto.managerId ? new Types.ObjectId(dto.managerId) : null,
      supervisorId: dto.supervisorId
        ? new Types.ObjectId(dto.supervisorId)
        : null,
    };
    delete data.initialPassword;
    return this.employeeModel.create(data);
  }

  async hardDelete(
    id: string,
    tenantId: Types.ObjectId,
  ): Promise<{ deletedCount: number; userId: Types.ObjectId | null }> {
    const doc = await this.employeeModel
      .findOne({ _id: id, tenantId })
      .select('userId')
      .lean()
      .exec();
    if (!doc) return { deletedCount: 0, userId: null };
    await this.employeeModel.deleteOne({ _id: id, tenantId }).exec();
    return { deletedCount: 1, userId: (doc.userId as Types.ObjectId | null) ?? null };
  }

  async findById(
    id: string,
    tenantId: Types.ObjectId,
  ): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOne({ _id: id, tenantId, isDeleted: { $ne: true } })
      .populate('branchId', 'name')
      .populate('departmentId', 'name')
      .populate('positionId', 'name')
      .populate('userId', 'role')
      .exec();
  }

  async findPaginated(
    filter: EmployeeListFilter,
    page: number,
    limit: number,
    sort: string,
  ): Promise<PaginatedEmployees> {
    const skip = (page - 1) * limit;
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    const sortField = sort.replace(/^-/, '');

    // Cast to any to allow dynamic filter with $or/$and operators
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mongoFilter = { ...filter, isDeleted: { $ne: true } } as any;

    const [employees, total] = await Promise.all([
      this.employeeModel
        .find(mongoFilter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('branchId', 'name')
        .populate('departmentId', 'name')
        .populate('positionId', 'name')
        .populate('userId', 'role')
        .exec(),
      this.employeeModel.countDocuments(mongoFilter).exec(),
    ]);

    return { employees, total };
  }

  async update(
    id: string,
    tenantId: Types.ObjectId,
    dto: UpdateEmployeeDto,
  ): Promise<EmployeeDocument | null> {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.branchId) updateData.branchId = new Types.ObjectId(dto.branchId);
    if (dto.departmentId)
      updateData.departmentId = new Types.ObjectId(dto.departmentId);
    if (dto.positionId)
      updateData.positionId = new Types.ObjectId(dto.positionId);
    if (dto.managerId) updateData.managerId = new Types.ObjectId(dto.managerId);
    if (dto.supervisorId)
      updateData.supervisorId = new Types.ObjectId(dto.supervisorId);
    return this.employeeModel
      .findOneAndUpdate({ _id: id, tenantId }, updateData, {
        returnDocument: 'after',
      })
      .exec();
  }

  async setStatus(
    id: string,
    tenantId: Types.ObjectId,
    status: EmployeeStatus,
  ): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOneAndUpdate(
        { _id: id, tenantId },
        { status },
        { returnDocument: 'after' },
      )
      .exec();
  }

  async linkUser(
    id: string,
    tenantId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.employeeModel
      .findOneAndUpdate({ _id: id, tenantId }, { userId })
      .exec();
  }

  async findByUserId(userId: Types.ObjectId): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOne({ userId, isDeleted: { $ne: true } })
      .select(
        'employeeCode firstName lastName email photoUrl bankName bankAccount employmentType startDate status branchId departmentId positionId',
      )
      .populate('positionId', 'name banding')
      .populate('departmentId', 'name')
      .populate('branchId', 'name')
      .exec();
  }

  async findFullByUserIdAndTenant(
    userId: Types.ObjectId,
    tenantId: Types.ObjectId,
  ): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOne({ userId, tenantId, isDeleted: { $ne: true } })
      .populate('branchId', 'name')
      .populate('departmentId', 'name')
      .populate('positionId', 'name')
      .exec();
  }

  async updateByUserIdAndTenant(
    userId: Types.ObjectId,
    tenantId: Types.ObjectId,
    data: Partial<Record<string, unknown>>,
  ): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOneAndUpdate({ userId, tenantId, isDeleted: { $ne: true } }, data, { returnDocument: 'after' })
      .populate('branchId', 'name')
      .populate('departmentId', 'name')
      .populate('positionId', 'name')
      .exec();
  }

  // Returns raw ObjectId for branchId — do NOT populate, needed by geofence lookup
  async findByUserIdAndTenant(
    userId: Types.ObjectId,
    tenantId: Types.ObjectId,
  ): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOne({ userId, tenantId, isDeleted: { $ne: true } })
      .select(
        'employeeCode firstName lastName status branchId managerId supervisorId userId',
      )
      .exec();
  }

  async countByTenant(tenantId: Types.ObjectId): Promise<number> {
    return this.employeeModel
      .countDocuments({
        tenantId,
        isDeleted: { $ne: true },
        status: { $nin: ['RESIGNED', 'TERMINATED'] },
      })
      .exec();
  }

  async countActive(
    tenantId: Types.ObjectId,
    branchId?: Types.ObjectId,
  ): Promise<number> {
    return this.employeeModel
      .countDocuments({
        tenantId,
        isDeleted: { $ne: true },
        status: 'ACTIVE',
        ...(branchId ? { branchId } : {}),
      })
      .exec();
  }

  async findByIds(
    ids: string[],
    tenantId: Types.ObjectId,
  ): Promise<EmployeeDocument[]> {
    return this.employeeModel
      .find({
        _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
        tenantId,
        isDeleted: { $ne: true },
      })
      .select('firstName lastName employeeCode positionId departmentId')
      .populate('positionId', 'name')
      .lean()
      .exec() as unknown as EmployeeDocument[];
  }

  async findAllActive(
    tenantId: Types.ObjectId,
    branchId?: Types.ObjectId,
  ): Promise<EmployeeDocument[]> {
    const filter: Record<string, unknown> = { tenantId, status: 'ACTIVE', isDeleted: { $ne: true } };
    if (branchId) filter.branchId = branchId;
    return this.employeeModel
      .find(filter)
      .select('employeeCode firstName lastName positionId branchId')
      .populate('positionId', 'name')
      .populate('branchId', 'name')
      .lean()
      .exec() as unknown as EmployeeDocument[];
  }

  async generateNextCode(
    tenantId: Types.ObjectId,
    companyCode: string,
    year: number,
  ): Promise<string> {
    const prefix = `${companyCode}-${year}-`;
    // Use max sequence (not count) so hard-deleted employees don't cause duplicates
    const last = await this.employeeModel
      .findOne({ tenantId, employeeCode: { $regex: `^${prefix}` } })
      .sort({ employeeCode: -1 })
      .select('employeeCode')
      .lean()
      .exec();
    const lastSeq = last?.employeeCode
      ? parseInt(last.employeeCode.slice(prefix.length), 10)
      : 0;
    const seq = String(lastSeq + 1).padStart(4, '0');
    return `${prefix}${seq}`;
  }

  async findByEmployeeCode(
    tenantId: Types.ObjectId,
    employeeCode: string,
  ): Promise<EmployeeDocument | null> {
    return this.employeeModel.findOne({ tenantId, employeeCode, isDeleted: { $ne: true } }).exec();
  }
}
