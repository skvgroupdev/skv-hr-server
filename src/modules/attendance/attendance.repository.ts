import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AttendanceLog,
  AttendanceLogDocument,
  AttendanceStatus,
  AttendanceType,
} from './schemas/attendance-log.schema';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectModel(AttendanceLog.name)
    private readonly logModel: Model<AttendanceLogDocument>,
  ) {}

  create(data: Partial<AttendanceLog>): Promise<AttendanceLogDocument> {
    return this.logModel.create(data);
  }

  findById(
    id: string,
    tenantId: Types.ObjectId,
  ): Promise<AttendanceLogDocument | null> {
    return this.logModel.findOne({ _id: id, tenantId }).exec();
  }

  findTodayCheckIn(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
  ): Promise<AttendanceLogDocument | null> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.logModel
      .findOne({
        employeeId,
        tenantId,
        type: 'CHECK_IN',
        checkTime: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: 'MANUAL_ADJUSTED' },
      })
      .sort({ checkTime: -1 })
      .exec();
  }

  findTodayLogs(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
  ): Promise<AttendanceLogDocument[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.logModel
      .find({
        employeeId,
        tenantId,
        checkTime: { $gte: startOfDay, $lte: endOfDay },
      })
      .sort({ checkTime: 1 })
      .exec();
  }

  async findPaginated(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
    page: number,
    limit: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = { tenantId, employeeId };
    if (startDate || endDate) {
      filter.serverTime = {};
      if (startDate)
        (filter.serverTime as Record<string, unknown>).$gte = startDate;
      if (endDate)
        (filter.serverTime as Record<string, unknown>).$lte = endDate;
    }

    const [logs, total] = await Promise.all([
      this.logModel
        .find(filter)
        .sort({ serverTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.logModel.countDocuments(filter).exec(),
    ]);

    return { logs, total };
  }

  findByDateRange(
    tenantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    branchId?: Types.ObjectId,
  ): Promise<AttendanceLogDocument[]> {
    const filter: Record<string, unknown> = {
      tenantId,
      checkTime: { $gte: startDate, $lte: endDate },
    };
    if (branchId) filter.branchId = branchId;
    return this.logModel.find(filter).sort({ serverTime: -1 }).exec();
  }

  findByStatus(
    tenantId: Types.ObjectId,
    status: AttendanceStatus,
    startDate: Date,
    endDate: Date,
    branchId?: Types.ObjectId,
  ): Promise<AttendanceLogDocument[]> {
    const filter: Record<string, unknown> = {
      tenantId,
      status,
      checkTime: { $gte: startDate, $lte: endDate },
    };
    if (branchId) filter.branchId = branchId;
    return this.logModel.find(filter).exec();
  }

  updateLog(
    id: string,
    tenantId: Types.ObjectId,
    update: Partial<AttendanceLog>,
  ): Promise<AttendanceLogDocument | null> {
    return this.logModel
      .findOneAndUpdate({ _id: id, tenantId }, update, {
        returnDocument: 'after',
      })
      .exec();
  }

  updateStatus(
    id: string,
    status: AttendanceStatus,
  ): Promise<AttendanceLogDocument | null> {
    return this.logModel
      .findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
      .exec();
  }

  async findDailyPaginated(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
    page: number,
    limit: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    const matchStage: Record<string, unknown> = { tenantId, employeeId };
    if (startDate || endDate) {
      matchStage.checkTime = {};
      if (startDate)
        (matchStage.checkTime as Record<string, unknown>).$gte = startDate;
      if (endDate)
        (matchStage.checkTime as Record<string, unknown>).$lte = endDate;
    }

    // Group by Bangkok date (UTC+7): add 7h offset before truncating to date
    const groupStage = {
      _id: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: { $add: ['$checkTime', 7 * 60 * 60 * 1000] },
        },
      },
      logs: { $push: '$$ROOT' },
    };

    const [result] = await this.logModel.aggregate([
      { $match: matchStage },
      { $sort: { checkTime: -1 } },
      { $group: groupStage },
      { $sort: { _id: -1 } },
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    const days: Array<{ _id: string; logs: AttendanceLog[] }> =
      result?.data ?? [];
    const total: number = result?.totalCount?.[0]?.count ?? 0;

    return { days, total };
  }

  findByType(
    tenantId: Types.ObjectId,
    type: AttendanceType,
    startDate: Date,
    endDate: Date,
    branchId?: Types.ObjectId,
  ): Promise<AttendanceLogDocument[]> {
    const filter: Record<string, unknown> = {
      tenantId,
      type,
      checkTime: { $gte: startDate, $lte: endDate },
    };
    if (branchId) filter.branchId = branchId;
    return this.logModel.find(filter).exec();
  }

  async findCheckedInEmployeeIds(
    tenantId: Types.ObjectId,
    start: Date,
    end: Date,
  ): Promise<string[]> {
    const logs = await this.logModel
      .find({
        tenantId,
        type: 'CHECK_IN',
        checkTime: { $gte: start, $lte: end },
      })
      .select('employeeId')
      .lean()
      .exec();
    const uniqueIds = [...new Set(logs.map((l) => l.employeeId.toString()))];
    return uniqueIds;
  }

  async getSummaryForDate(
    tenantId: Types.ObjectId,
    date: Date,
    branchId?: Types.ObjectId,
  ): Promise<{ checkedIn: number; late: number }> {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    const checkIns = await this.logModel
      .find({
        tenantId,
        type: 'CHECK_IN',
        checkTime: { $gte: start, $lte: end },
        ...(branchId ? { branchId } : {}),
      })
      .lean();

    const checkedIn = checkIns.length;
    const late = checkIns.filter(
      (log) => log.status === 'LATE' || log.status === 'LATE_MINOR',
    ).length;

    return { checkedIn, late };
  }

  findLogsForEmployeeInMonth(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
    start: Date,
    end: Date,
  ): Promise<AttendanceLogDocument[]> {
    return this.logModel
      .find({
        tenantId,
        employeeId,
        checkTime: { $gte: start, $lte: end },
      })
      .sort({ checkTime: 1 })
      .lean()
      .exec() as unknown as Promise<AttendanceLogDocument[]>;
  }

  async countPresenceDaysByEmployee(
    tenantId: Types.ObjectId,
    employeeIds: Types.ObjectId[],
    startDate: Date,
    endDate: Date,
  ): Promise<Map<string, number>> {
    const rows = await this.logModel
      .aggregate<{ _id: Types.ObjectId; days: number }>([
        {
          $match: {
            tenantId,
            employeeId: { $in: employeeIds },
            type: 'CHECK_IN',
            checkTime: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              employeeId: '$employeeId',
              date: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: { $add: ['$checkTime', 7 * 60 * 60 * 1000] },
                },
              },
            },
          },
        },
        { $group: { _id: '$_id.employeeId', days: { $sum: 1 } } },
      ])
      .exec();
    return new Map(rows.map((row) => [row._id.toString(), row.days]));
  }
}
