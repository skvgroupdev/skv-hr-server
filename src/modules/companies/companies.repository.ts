import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

interface PaginatedResult {
  companies: CompanyDocument[];
  total: number;
}

@Injectable()
export class CompaniesRepository {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async create(dto: CreateCompanyDto): Promise<CompanyDocument> {
    return this.companyModel.create(dto);
  }

  async findById(id: string): Promise<CompanyDocument | null> {
    return this.companyModel.findById(id).exec();
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
    return this.companyModel.findByIdAndUpdate(id, dto, { returnDocument: 'after' }).exec();
  }

  async updateStatus(id: string, status: string): Promise<CompanyDocument | null> {
    return this.companyModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after' }).exec();
  }
}
