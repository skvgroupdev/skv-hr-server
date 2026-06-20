import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Branch, BranchDocument } from '../branches/schemas/branch.schema';
import {
  Employee,
  EmployeeDocument,
} from '../employees/schemas/employee.schema';

interface PaginatedResult {
  companies: CompanyDocument[];
  total: number;
}

@Injectable()
export class CompaniesRepository {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(Branch.name) private readonly branchModel: Model<BranchDocument>,
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>,
  ) {}

  async create(dto: CreateCompanyDto): Promise<CompanyDocument> {
    const data = {
      ...dto,
      planId: dto.planId ? new Types.ObjectId(dto.planId) : null,
    };
    return this.companyModel.create(data);
  }

  async findById(id: string): Promise<CompanyDocument | null> {
    return this.companyModel.findById(id).exec();
  }

  async findByIdWithPlan(id: string): Promise<CompanyDocument | null> {
    return this.companyModel.findById(id).populate('planId').exec();
  }

  async findPaginated(page: number, limit: number, sort: string): Promise<PaginatedResult> {
    const skip = (page - 1) * limit;
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    const sortField = sort.replace(/^-/, '');

    const [companies, total] = await Promise.all([
      this.companyModel
        .find()
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.companyModel.countDocuments().exec(),
    ]);

    return { companies, total };
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<CompanyDocument | null> {
    return this.companyModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .populate('planId')
      .exec();
  }

  async updateStatus(id: string, status: string): Promise<CompanyDocument | null> {
    return this.companyModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after' }).exec();
  }

  async countActiveEmployees(companyId: Types.ObjectId): Promise<number> {
    return this.employeeModel
      .countDocuments({
        tenantId: companyId,
        status: { $nin: ['RESIGNED', 'TERMINATED'] },
      })
      .exec();
  }

  async countActiveBranches(companyId: Types.ObjectId): Promise<number> {
    return this.branchModel
      .countDocuments({ tenantId: companyId, isActive: true })
      .exec();
  }
}
