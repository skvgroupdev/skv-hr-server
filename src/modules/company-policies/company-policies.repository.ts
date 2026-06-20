import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CompanyPolicy,
  CompanyPolicyDocument,
} from './schemas/company-policy.schema';

@Injectable()
export class CompanyPoliciesRepository {
  constructor(
    @InjectModel(CompanyPolicy.name)
    private readonly model: Model<CompanyPolicyDocument>,
  ) {}

  findEffectiveAt(
    tenantId: Types.ObjectId,
    at: Date,
  ): Promise<CompanyPolicyDocument | null> {
    return this.model
      .findOne({ tenantId, effectiveFrom: { $lte: at } })
      .sort({ effectiveFrom: -1 })
      .exec();
  }

  findLatest(tenantId: Types.ObjectId): Promise<CompanyPolicyDocument | null> {
    return this.model.findOne({ tenantId }).sort({ effectiveFrom: -1 }).exec();
  }

  create(data: Partial<CompanyPolicy>): Promise<CompanyPolicyDocument> {
    return this.model.create(data);
  }
}
