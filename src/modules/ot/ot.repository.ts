import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OTPolicy, OTPolicyDocument } from './schemas/ot-policy.schema';
import { OTRequest, OTRequestDocument } from './schemas/ot-request.schema';

@Injectable()
export class OTRepository {
  constructor(
    @InjectModel(OTPolicy.name) private readonly policyModel: Model<OTPolicyDocument>,
    @InjectModel(OTRequest.name) private readonly requestModel: Model<OTRequestDocument>,
  ) {}

  async getPolicy(tenantId: Types.ObjectId): Promise<OTPolicyDocument | null> {
    return this.policyModel.findOne({ tenantId }).exec();
  }

  async upsertPolicy(tenantId: Types.ObjectId, data: Partial<OTPolicy>): Promise<OTPolicyDocument> {
    return this.policyModel.findOneAndUpdate(
      { tenantId },
      { ...data, tenantId },
      { upsert: true, returnDocument: 'after' },
    ).exec() as Promise<OTPolicyDocument>;
  }

  createRequest(data: Partial<OTRequest>): Promise<OTRequestDocument> {
    return this.requestModel.create(data);
  }

  findById(id: string, tenantId: Types.ObjectId): Promise<OTRequestDocument | null> {
    return this.requestModel.findOne({ _id: id, tenantId }).exec();
  }

  async findByEmployee(tenantId: Types.ObjectId, employeeId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const filter = { tenantId, employeeId };
    const [items, total] = await Promise.all([
      this.requestModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.requestModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  findPending(tenantId: Types.ObjectId): Promise<OTRequestDocument[]> {
    return this.requestModel.find({ tenantId, status: 'PENDING' }).sort({ createdAt: -1 }).exec();
  }

  updateRequest(id: string, tenantId: Types.ObjectId, data: Partial<OTRequest>): Promise<OTRequestDocument | null> {
    return this.requestModel.findOneAndUpdate({ _id: id, tenantId }, data, { returnDocument: 'after' }).exec();
  }

  findApprovedInDateRange(
    tenantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    employeeId?: Types.ObjectId,
  ): Promise<OTRequestDocument[]> {
    const filter: Record<string, unknown> = {
      tenantId,
      status: 'APPROVED',
      date: { $gte: startDate, $lte: endDate },
    };
    if (employeeId) filter.employeeId = employeeId;
    return this.requestModel.find(filter).exec();
  }

  async findReport(tenantId: Types.ObjectId, filter: Record<string, unknown>, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const query = { tenantId, ...filter };
    const [items, total] = await Promise.all([
      this.requestModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.requestModel.countDocuments(query).exec(),
    ]);
    return { items, total };
  }
}
