import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LeaveType, LeaveTypeDocument } from './schemas/leave-type.schema';
import {
  LeaveBalance,
  LeaveBalanceDocument,
} from './schemas/leave-balance.schema';
import {
  LeaveRequest,
  LeaveRequestDocument,
} from './schemas/leave-request.schema';

const MAX_LIMIT = 100;

@Injectable()
export class LeaveRepository {
  constructor(
    @InjectModel(LeaveType.name)
    private readonly leaveTypeModel: Model<LeaveTypeDocument>,
    @InjectModel(LeaveBalance.name)
    private readonly balanceModel: Model<LeaveBalanceDocument>,
    @InjectModel(LeaveRequest.name)
    private readonly requestModel: Model<LeaveRequestDocument>,
  ) {}

  // LeaveType
  createLeaveType(data: Partial<LeaveType>): Promise<LeaveTypeDocument> {
    return this.leaveTypeModel.create(data);
  }

  findAllLeaveTypes(tenantId: Types.ObjectId): Promise<LeaveTypeDocument[]> {
    return this.leaveTypeModel.find({ tenantId, isActive: true }).exec();
  }

  findLeaveTypeById(
    id: string,
    tenantId: Types.ObjectId,
  ): Promise<LeaveTypeDocument | null> {
    return this.leaveTypeModel.findOne({ _id: id, tenantId }).exec();
  }

  updateLeaveType(
    id: string,
    tenantId: Types.ObjectId,
    data: Partial<LeaveType>,
  ): Promise<LeaveTypeDocument | null> {
    return this.leaveTypeModel
      .findOneAndUpdate({ _id: id, tenantId }, data, {
        returnDocument: 'after',
      })
      .exec();
  }

  softDeleteLeaveType(
    id: string,
    tenantId: Types.ObjectId,
  ): Promise<LeaveTypeDocument | null> {
    return this.leaveTypeModel
      .findOneAndUpdate(
        { _id: id, tenantId },
        { isActive: false },
        { returnDocument: 'after' },
      )
      .exec();
  }

  // LeaveBalance
  findBalance(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
    leaveTypeId: Types.ObjectId,
    year: number,
  ): Promise<LeaveBalanceDocument | null> {
    return this.balanceModel
      .findOne({ tenantId, employeeId, leaveTypeId, year })
      .exec();
  }

  findBalancesByEmployee(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
  ): Promise<LeaveBalanceDocument[]> {
    const year = new Date().getFullYear();
    return this.balanceModel
      .find({ tenantId, employeeId, year })
      .populate('leaveTypeId')
      .exec();
  }

  async upsertBalance(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
    leaveTypeId: Types.ObjectId,
    year: number,
    adjustUsed: number,
  ): Promise<LeaveBalanceDocument> {
    const balance = await this.balanceModel
      .findOneAndUpdate(
        { tenantId, employeeId, leaveTypeId, year },
        {
          $inc: { usedDays: adjustUsed, remainingDays: -adjustUsed },
        },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return balance!;
  }

  createBalance(data: Partial<LeaveBalance>): Promise<LeaveBalanceDocument> {
    return this.balanceModel.create(data);
  }

  async adjustBalance(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
    leaveTypeId: Types.ObjectId,
    year: number,
    adjustment: number,
  ): Promise<LeaveBalanceDocument | null> {
    return this.balanceModel
      .findOneAndUpdate(
        { tenantId, employeeId, leaveTypeId, year },
        { $inc: { totalDays: adjustment, remainingDays: adjustment } },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
  }

  // LeaveRequest
  createRequest(data: Partial<LeaveRequest>): Promise<LeaveRequestDocument> {
    return this.requestModel.create(data);
  }

  findRequestById(
    id: string,
    tenantId: Types.ObjectId,
  ): Promise<LeaveRequestDocument | null> {
    return this.requestModel.findOne({ _id: id, tenantId }).exec();
  }

  async findRequestsByEmployee(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;
    const filter = { tenantId, employeeId };
    const [items, total] = await Promise.all([
      this.requestModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.requestModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  findPendingRequests(
    tenantId: Types.ObjectId,
  ): Promise<LeaveRequestDocument[]> {
    return this.requestModel
      .find({ tenantId, status: 'PENDING' })
      .sort({ createdAt: -1 })
      .populate('employeeId', 'firstName lastName phone')
      .populate('leaveTypeId', 'name code')
      .exec();
  }

  updateRequest(
    id: string,
    tenantId: Types.ObjectId,
    data: Partial<LeaveRequest>,
  ): Promise<LeaveRequestDocument | null> {
    return this.requestModel
      .findOneAndUpdate({ _id: id, tenantId }, data, {
        returnDocument: 'after',
      })
      .exec();
  }

  findOverlapping(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ): Promise<LeaveRequestDocument | null> {
    return this.requestModel
      .findOne({
        tenantId,
        employeeId,
        status: { $in: ['PENDING', 'APPROVED'] },
        $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
      })
      .exec();
  }

  // Returns leave requests that cover today (PENDING or APPROVED)
  findTodayActive(tenantId: Types.ObjectId, date: Date): Promise<LeaveRequestDocument[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return this.requestModel
      .find({
        tenantId,
        status: { $in: ['PENDING', 'APPROVED'] },
        startDate: { $lte: end },
        endDate: { $gte: start },
      })
      .select('employeeId status leaveTypeId')
      .populate('leaveTypeId', 'name')
      .populate('employeeId', 'firstName lastName employeeCode')
      .lean()
      .exec();
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
      this.requestModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('employeeId', 'firstName lastName phone')
        .populate('leaveTypeId', 'name code')
        .exec(),
      this.requestModel.countDocuments(query).exec(),
    ]);
    return { items, total };
  }

  async findApprovedInDateRange(
    tenantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ): Promise<
    {
      employeeId: Types.ObjectId;
      totalDays: number;
      category: 'LEAVE' | 'REST_DAY';
      isPaid: boolean;
    }[]
  > {
    return this.requestModel
      .find({
        tenantId,
        status: 'APPROVED',
        startDate: { $gte: startDate },
        endDate: { $lte: endDate },
      })
      .select('employeeId totalDays leaveTypeId')
      .populate('leaveTypeId', 'category isPaid')
      .lean()
      .exec()
      .then((items) =>
        items.map((item) => ({
          employeeId: item.employeeId,
          totalDays: item.totalDays,
          category:
            (
              item.leaveTypeId as unknown as
                | { category?: 'LEAVE' | 'REST_DAY'; isPaid?: boolean }
                | undefined
            )?.category ?? 'LEAVE',
          isPaid:
            (item.leaveTypeId as unknown as { isPaid?: boolean } | undefined)
              ?.isPaid ?? false,
        })),
      );
  }
}
