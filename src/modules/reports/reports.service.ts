import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { LeaveRepository } from '../leave/leave.repository';
import { OTRepository } from '../ot/ot.repository';
import { ReportQueryDto } from './report-query.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private readonly leaveRepository: LeaveRepository,
    private readonly otRepository: OTRepository,
  ) {}

  async getDailyAttendance(tenantId: string, query: ReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const date = query.date ? new Date(query.date) : new Date();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const branchId = query.branchId ? new Types.ObjectId(query.branchId) : undefined;

    return this.attendanceRepository.findByDateRange(tenantObjectId, start, end, branchId);
  }

  async getMonthlyAttendance(tenantId: string, query: ReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const year = parseInt(query.year ?? String(new Date().getFullYear()), 10);
    const month = parseInt(query.month ?? String(new Date().getMonth() + 1), 10);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    const branchId = query.branchId ? new Types.ObjectId(query.branchId) : undefined;

    return this.attendanceRepository.findByDateRange(tenantObjectId, start, end, branchId);
  }

  async getLateAttendance(tenantId: string, query: ReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const start = query.startDate ? new Date(query.startDate) : new Date();
    const end = query.endDate ? new Date(query.endDate) : new Date();
    const branchId = query.branchId ? new Types.ObjectId(query.branchId) : undefined;

    return this.attendanceRepository.findByStatus(tenantObjectId, 'LATE', start, end, branchId);
  }

  async getAbsentAttendance(tenantId: string, query: ReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const date = query.date ? new Date(query.date) : new Date();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const branchId = query.branchId ? new Types.ObjectId(query.branchId) : undefined;

    return this.attendanceRepository.findByStatus(tenantObjectId, 'ABSENT', start, end, branchId);
  }

  async getMissingCheckout(tenantId: string, query: ReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const date = query.date ? new Date(query.date) : new Date();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const branchId = query.branchId ? new Types.ObjectId(query.branchId) : undefined;

    return this.attendanceRepository.findByStatus(tenantObjectId, 'MISSING_CHECKOUT', start, end, branchId);
  }

  async getLeaveSummary(tenantId: string, query: ReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const filter: Record<string, unknown> = { status: 'APPROVED' };
    if (query.leaveTypeId) filter.leaveTypeId = new Types.ObjectId(query.leaveTypeId);
    if (query.startDate || query.endDate) {
      filter.startDate = {};
      if (query.startDate) (filter.startDate as Record<string, unknown>).$gte = new Date(query.startDate);
      if (query.endDate) (filter.startDate as Record<string, unknown>).$lte = new Date(query.endDate);
    }

    const { items } = await this.leaveRepository.findReport(tenantObjectId, filter, 1, 1000);
    return items;
  }

  async getLeaveBalance(tenantId: string, query: ReportQueryDto) {
    // Returns all leave balances for the tenant's employees for a given year
    const year = parseInt(query.year ?? String(new Date().getFullYear()), 10);
    // This uses a direct aggregate approach - proxy via repository
    // For MVP, return summary message; full impl needs employee joining
    return { message: 'Leave balance report', year };
  }

  async getOTSummary(tenantId: string, query: ReportQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const start = query.startDate ? new Date(query.startDate) : new Date();
    const end = query.endDate ? new Date(query.endDate) : new Date();

    return this.otRepository.findApprovedInDateRange(tenantObjectId, start, end);
  }

  async getOTCost(tenantId: string, query: ReportQueryDto) {
    const requests = await this.getOTSummary(tenantId, query);
    const totalHours = requests.reduce((sum, r) => sum + (r.totalHours ?? 0), 0);
    return { requests, totalHours };
  }
}
