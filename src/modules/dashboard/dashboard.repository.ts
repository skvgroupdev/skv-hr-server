import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employee, EmployeeDocument } from '../employees/schemas/employee.schema';
import { Branch, BranchDocument } from '../branches/schemas/branch.schema';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { LeaveRepository } from '../leave/leave.repository';
import { OTRepository } from '../ot/ot.repository';
import { OutsideWorkRepository } from '../outside-work/outside-work.repository';
import type { RecentEmployeeDto, MonthlyLeaveOtSummaryDto } from './dto/dashboard.dto';

@Injectable()
export class DashboardRepository {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>,
    @InjectModel(Branch.name) private readonly branchModel: Model<BranchDocument>,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly leaveRepository: LeaveRepository,
    private readonly otRepository: OTRepository,
    private readonly outsideWorkRepository: OutsideWorkRepository,
  ) {}

  async countEmployees(tenantId: Types.ObjectId) {
    const [total, active, inactive] = await Promise.all([
      this.employeeModel.countDocuments({ tenantId }).exec(),
      this.employeeModel.countDocuments({ tenantId, status: 'ACTIVE' }).exec(),
      this.employeeModel.countDocuments({ tenantId, status: 'INACTIVE' }).exec(),
    ]);
    return { total, active, inactive };
  }

  async countTodayCheckIns(tenantId: Types.ObjectId): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await this.attendanceRepository.findByType(tenantId, 'CHECK_IN', startOfDay, endOfDay);
    return logs.length;
  }

  async countPendingRequests(tenantId: Types.ObjectId) {
    const [leaveList, otList, outsideList] = await Promise.all([
      this.leaveRepository.findPendingRequests(tenantId),
      this.otRepository.findPending(tenantId),
      this.outsideWorkRepository.findPending(tenantId),
    ]);
    return { leave: leaveList.length, ot: otList.length, outsideWork: outsideList.length };
  }

  async countBranches(tenantId: Types.ObjectId) {
    const [total, active] = await Promise.all([
      this.branchModel.countDocuments({ tenantId }).exec(),
      this.branchModel.countDocuments({ tenantId, isActive: true }).exec(),
    ]);
    return { total, active };
  }

  async findRecentEmployees(tenantId: Types.ObjectId, limit = 5): Promise<RecentEmployeeDto[]> {
    const docs = await this.employeeModel
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('firstName lastName employeeCode createdAt')
      .lean()
      .exec();

    return docs.map((doc) => ({
      id: (doc._id as Types.ObjectId).toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      employeeCode: doc.employeeCode,
      createdAt: (doc as unknown as { createdAt: Date }).createdAt,
    }));
  }

  async getMonthlySummary(tenantId: Types.ObjectId): Promise<MonthlyLeaveOtSummaryDto[]> {
    const year = new Date().getFullYear();
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

    const [leaveRequests, otRequests] = await Promise.all([
      this.leaveRepository.findReport(tenantId, { status: 'APPROVED', startDate: { $gte: yearStart, $lte: yearEnd } }, 1, 1000),
      this.otRepository.findApprovedInDateRange(tenantId, yearStart, yearEnd),
    ]);

    return buildMonthlySummary(leaveRequests.items, otRequests);
  }
}

function buildMonthlySummary(
  leaveItems: Array<{ startDate: Date; totalDays?: number }>,
  otItems: Array<{ date: Date; totalHours?: number }>,
): MonthlyLeaveOtSummaryDto[] {
  const months: MonthlyLeaveOtSummaryDto[] = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    approvedLeave: 0,
    approvedOt: 0,
    otHours: 0,
  }));

  for (const leave of leaveItems) {
    const month = new Date(leave.startDate).getMonth();
    months[month].approvedLeave += leave.totalDays ?? 1;
  }

  for (const ot of otItems) {
    const month = new Date(ot.date).getMonth();
    months[month].approvedOt += 1;
    months[month].otHours += ot.totalHours ?? 0;
  }

  return months;
}
