import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { PayrollPeriod, PayrollPeriodDocument } from './schemas/payroll-period.schema';
import { Payslip, PayslipDocument } from './schemas/payslip.schema';

const MAX_LIMIT = 100;

@Injectable()
export class PayrollRepository {
  constructor(
    @InjectModel(PayrollPeriod.name) private readonly periodModel: Model<PayrollPeriodDocument>,
    @InjectModel(Payslip.name) private readonly payslipModel: Model<PayslipDocument>,
  ) {}

  createPeriod(data: Partial<PayrollPeriod>): Promise<PayrollPeriodDocument> {
    return this.periodModel.create(data);
  }

  findPeriodById(id: string, tenantId: Types.ObjectId): Promise<PayrollPeriodDocument | null> {
    return this.periodModel.findOne({ _id: id, tenantId }).exec();
  }

  async findPeriodsPaginated(tenantId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.periodModel.find({ tenantId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.periodModel.countDocuments({ tenantId }).exec(),
    ]);
    return { items, total };
  }

  updatePeriod(id: string, tenantId: Types.ObjectId, data: Partial<PayrollPeriod>): Promise<PayrollPeriodDocument | null> {
    return this.periodModel.findOneAndUpdate({ _id: id, tenantId }, data, { returnDocument: 'after' }).exec();
  }

  async createPayslips(payslips: Partial<Payslip>[]): Promise<PayslipDocument[]> {
    return this.payslipModel.insertMany(payslips) as unknown as PayslipDocument[];
  }

  async findPayslipsByPeriod(tenantId: Types.ObjectId, periodId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const filter = { tenantId, payrollPeriodId: periodId };
    const [items, total] = await Promise.all([
      this.payslipModel
        .find(filter)
        .populate('employeeId', 'firstName lastName employeeCode')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.payslipModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  async findMyPayslips(tenantId: Types.ObjectId, employeeId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const filter = { tenantId, employeeId };
    const [items, total] = await Promise.all([
      this.payslipModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.payslipModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  findPayslipById(id: string, tenantId: Types.ObjectId): Promise<PayslipDocument | null> {
    return this.payslipModel.findOne({ _id: id, tenantId }).exec();
  }

  findPayslipByIdWithPopulate(id: string, tenantId: Types.ObjectId): Promise<PayslipDocument | null> {
    return this.payslipModel
      .findOne({ _id: id, tenantId })
      .populate('employeeId', 'firstName lastName employeeCode')
      .populate('payrollPeriodId', 'name startDate endDate')
      .exec();
  }

  findPayslipByEmployeeAndPeriod(
    tenantId: Types.ObjectId,
    periodId: Types.ObjectId,
    employeeId: Types.ObjectId,
  ): Promise<PayslipDocument | null> {
    return this.payslipModel.findOne({ tenantId, payrollPeriodId: periodId, employeeId }).exec();
  }

  async findAllPayslipsPaginated(
    tenantId: Types.ObjectId,
    filter: { periodId?: string; employeeId?: string; status?: string; employeeIds?: Types.ObjectId[]; startDate?: string; endDate?: string },
    page: number,
    limit: number,
    sort: string,
  ): Promise<{ data: PayslipDocument[]; total: number }> {
    const safeLimit = Math.min(MAX_LIMIT, limit);
    const skip = (page - 1) * safeLimit;
    const query: Record<string, unknown> = { tenantId };

    if (filter.periodId) query.payrollPeriodId = new Types.ObjectId(filter.periodId);
    if (filter.status) query.status = filter.status;
    if (filter.employeeId) query.employeeId = new Types.ObjectId(filter.employeeId);
    if (filter.employeeIds) query.employeeId = { $in: filter.employeeIds };
    if (filter.startDate) query['createdAt'] = { ...(query['createdAt'] as object), $gte: new Date(filter.startDate) };
    if (filter.endDate) query['createdAt'] = { ...(query['createdAt'] as object), $lte: new Date(filter.endDate) };

    const sortObj = buildSortObject(sort);
    const [data, total] = await Promise.all([
      this.payslipModel
        .find(query)
        .populate('employeeId', 'firstName lastName employeeCode')
        .sort(sortObj)
        .skip(skip)
        .limit(safeLimit)
        .exec(),
      this.payslipModel.countDocuments(query).exec(),
    ]);
    return { data, total };
  }

  async findPayslipsByEmployee(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<{ data: PayslipDocument[]; total: number }> {
    const safeLimit = Math.min(MAX_LIMIT, limit);
    const skip = (page - 1) * safeLimit;
    const filter = { tenantId, employeeId };
    const [data, total] = await Promise.all([
      this.payslipModel
        .find(filter)
        .populate('payrollPeriodId', 'name startDate endDate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .exec(),
      this.payslipModel.countDocuments(filter).exec(),
    ]);
    return { data, total };
  }

  async aggregatePeriodReport(tenantId: Types.ObjectId, periodId: Types.ObjectId) {
    const [result] = await this.payslipModel.aggregate([
      { $match: { tenantId, payrollPeriodId: periodId } },
      {
        $group: {
          _id: null,
          payslipCount: { $sum: 1 },
          approvedCount: { $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] } },
          totalGrossSalary: { $sum: '$grossSalary' },
          totalNetSalary: { $sum: '$netSalary' },
          totalEmployeeSsAmount: { $sum: '$employeeSsAmount' },
          totalEmployerSsAmount: { $sum: '$employerSsAmount' },
          totalIncomeTax: { $sum: '$incomeTax' },
          totalOtAmount: { $sum: '$otAmount' },
          totalLeaveDeductions: { $sum: '$leaveDeductionAmount' },
          totalAllowances: {
            $sum: {
              $reduce: {
                input: '$allowances',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.amount'] },
              },
            },
          },
          totalOtherDeductions: {
            $sum: {
              $reduce: {
                input: '$otherDeductions',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.amount'] },
              },
            },
          },
        },
      },
      { $project: { _id: 0 } },
    ]);

    return result ?? {
      payslipCount: 0,
      approvedCount: 0,
      totalGrossSalary: 0,
      totalNetSalary: 0,
      totalEmployeeSsAmount: 0,
      totalEmployerSsAmount: 0,
      totalIncomeTax: 0,
      totalOtAmount: 0,
      totalLeaveDeductions: 0,
      totalAllowances: 0,
      totalOtherDeductions: 0,
    };
  }

  async getFinanceSummaryByEmployee(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
  ): Promise<{
    totalPayslips: number;
    totalNetSalary: number;
    totalGrossSalary: number;
    averageNetSalary: number;
    monthlyBreakdown: { year: number; month: number; netSalary: number; grossSalary: number }[];
  }> {
    const [summary] = await this.payslipModel.aggregate([
      { $match: { tenantId, employeeId } },
      {
        $group: {
          _id: null,
          totalPayslips: { $sum: 1 },
          totalNetSalary: { $sum: '$netSalary' },
          totalGrossSalary: { $sum: '$grossSalary' },
          averageNetSalary: { $avg: '$netSalary' },
        },
      },
    ]);

    const monthlyBreakdown = await this.payslipModel.aggregate([
      { $match: { tenantId, employeeId } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          netSalary: { $sum: '$netSalary' },
          grossSalary: { $sum: '$grossSalary' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          netSalary: 1,
          grossSalary: 1,
        },
      },
    ]);

    return {
      totalPayslips: summary?.totalPayslips ?? 0,
      totalNetSalary: summary?.totalNetSalary ?? 0,
      totalGrossSalary: summary?.totalGrossSalary ?? 0,
      averageNetSalary: summary?.averageNetSalary ?? 0,
      monthlyBreakdown,
    };
  }
}

function buildSortObject(sort: string): Record<string, SortOrder> {
  const field = sort.startsWith('-') ? sort.slice(1) : sort;
  const order: SortOrder = sort.startsWith('-') ? -1 : 1;
  return { [field]: order };
}
