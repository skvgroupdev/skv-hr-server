import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OutsideWork, OutsideWorkDocument } from './schemas/outside-work.schema';

const MAX_LIMIT = 100;

@Injectable()
export class OutsideWorkRepository {
  constructor(
    @InjectModel(OutsideWork.name) private readonly model: Model<OutsideWorkDocument>,
  ) {}

  create(data: Partial<OutsideWork>): Promise<OutsideWorkDocument> {
    return this.model.create(data);
  }

  findById(id: string, tenantId: Types.ObjectId): Promise<OutsideWorkDocument | null> {
    return this.model.findOne({ _id: id, tenantId }).exec();
  }

  async findByEmployee(tenantId: Types.ObjectId, employeeId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const filter = { tenantId, employeeId };
    const [items, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  findPending(tenantId: Types.ObjectId): Promise<OutsideWorkDocument[]> {
    return this.model
      .find({ tenantId, status: 'PENDING' })
      .sort({ createdAt: -1 })
      .populate('employeeId', 'firstName lastName phone')
      .exec();
  }

  // Returns outside-work requests created today (any status except REJECTED)
  findTodayActive(tenantId: Types.ObjectId, date: Date): Promise<OutsideWorkDocument[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return this.model
      .find({
        tenantId,
        status: { $in: ['PENDING', 'APPROVED'] },
        createdAt: { $gte: start, $lte: end },
      })
      .select('employeeId status outsideType')
      .populate({
        path: 'employeeId',
        select: 'firstName lastName nickname employeeCode phone branchId',
        populate: { path: 'branchId', select: 'name' },
      })
      .lean()
      .exec();
  }

  update(id: string, tenantId: Types.ObjectId, update: Partial<OutsideWork>): Promise<OutsideWorkDocument | null> {
    return this.model.findOneAndUpdate({ _id: id, tenantId }, update, { returnDocument: 'after' }).exec();
  }

  async findReport(
    tenantId: Types.ObjectId,
    filter: Record<string, unknown>,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;
    const query = { tenantId, ...filter };
    const [items, total] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('employeeId', 'firstName lastName phone').exec(),
      this.model.countDocuments(query).exec(),
    ]);
    return { items, total };
  }
}
