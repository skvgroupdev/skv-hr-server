import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CompanyTaxConfig,
  CompanyTaxConfigDocument,
  TaxMode,
} from './schemas/company-tax-config.schema';
import { UpsertCompanyTaxConfigDto } from './dto/upsert-company-tax-config.dto';

@Injectable()
export class CompanyTaxConfigsRepository {
  constructor(
    @InjectModel(CompanyTaxConfig.name)
    private readonly model: Model<CompanyTaxConfigDocument>,
  ) {}

  findByTenant(tenantId: string): Promise<CompanyTaxConfigDocument | null> {
    return this.model.findOne({ tenantId: new Types.ObjectId(tenantId) }).exec();
  }

  async upsertByTenant(
    tenantId: string,
    dto: UpsertCompanyTaxConfigDto,
    updatedBy?: string,
  ): Promise<CompanyTaxConfigDocument> {
    const updatePayload: Partial<CompanyTaxConfig> & { updatedBy?: Types.ObjectId } = {
      ...(dto.taxConfigId && { taxConfigId: new Types.ObjectId(dto.taxConfigId) }),
      ...(dto.taxMode !== undefined && { taxMode: dto.taxMode }),
      ...(dto.enableEmployeeSs !== undefined && { enableEmployeeSs: dto.enableEmployeeSs }),
      ...(dto.enableEmployerSs !== undefined && { enableEmployerSs: dto.enableEmployerSs }),
      ...(dto.enableIncomeTax !== undefined && { enableIncomeTax: dto.enableIncomeTax }),
      ...(updatedBy && { updatedBy: new Types.ObjectId(updatedBy) }),
    };

    const result = await this.model
      .findOneAndUpdate(
        { tenantId: new Types.ObjectId(tenantId) },
        { $set: updatePayload },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
      )
      .exec();

    return result!;
  }

  createDefault(tenantId: string, taxConfigId: string): Promise<CompanyTaxConfigDocument> {
    return this.model.create({
      tenantId: new Types.ObjectId(tenantId),
      taxConfigId: new Types.ObjectId(taxConfigId),
      taxMode: TaxMode.FULL_DEDUCTION,
      enableEmployeeSs: true,
      enableEmployerSs: true,
      enableIncomeTax: true,
    });
  }

  findAll(): Promise<CompanyTaxConfigDocument[]> {
    return this.model.find().exec();
  }
}
