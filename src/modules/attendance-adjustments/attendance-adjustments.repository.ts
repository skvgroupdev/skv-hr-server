import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AttendanceAdjustment,
  AttendanceAdjustmentDocument,
} from './schemas/attendance-adjustment.schema';

@Injectable()
export class AttendanceAdjustmentsRepository {
  constructor(
    @InjectModel(AttendanceAdjustment.name)
    private readonly model: Model<AttendanceAdjustmentDocument>,
  ) {}

  create(
    data: Partial<AttendanceAdjustment>,
  ): Promise<AttendanceAdjustmentDocument> {
    return this.model.create(data);
  }

  findById(
    id: string,
    tenantId: Types.ObjectId,
  ): Promise<AttendanceAdjustmentDocument | null> {
    return this.model.findOne({ _id: id, tenantId }).exec();
  }

  findByEmployee(tenantId: Types.ObjectId, employeeId: Types.ObjectId) {
    return this.model
      .find({ tenantId, employeeId })
      .sort({ createdAt: -1 })
      .exec();
  }

  findAll(
    tenantId: Types.ObjectId,
    branchId?: Types.ObjectId,
    status?: AttendanceAdjustment['status'],
  ) {
    return this.model
      .find({
        tenantId,
        ...(branchId ? { branchId } : {}),
        ...(status ? { status } : {}),
      })
      .populate(
        'employeeId',
        'firstName lastName firstNameEn lastNameEn nickname employeeCode',
      )
      .sort({ createdAt: -1 })
      .exec();
  }

  findTodayActive(tenantId: Types.ObjectId, date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return this.model
      .find({ tenantId, workDate: { $gte: start, $lte: end }, status: { $in: ['PENDING', 'APPROVED'] } })
      .populate('employeeId', 'firstName lastName employeeCode')
      .sort({ createdAt: -1 })
      .exec();
  }

  update(
    id: string,
    tenantId: Types.ObjectId,
    data: Partial<AttendanceAdjustment>,
  ): Promise<AttendanceAdjustmentDocument | null> {
    return this.model
      .findOneAndUpdate({ _id: id, tenantId }, data, {
        returnDocument: 'after',
      })
      .exec();
  }
}
