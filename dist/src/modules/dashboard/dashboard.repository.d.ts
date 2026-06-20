import { Model, Types } from 'mongoose';
import { EmployeeDocument } from '../employees/schemas/employee.schema';
import { BranchDocument } from '../branches/schemas/branch.schema';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { LeaveRepository } from '../leave/leave.repository';
import { OTRepository } from '../ot/ot.repository';
import { OutsideWorkRepository } from '../outside-work/outside-work.repository';
import type { RecentEmployeeDto, MonthlyLeaveOtSummaryDto } from './dto/dashboard.dto';
export declare class DashboardRepository {
    private readonly employeeModel;
    private readonly branchModel;
    private readonly attendanceRepository;
    private readonly leaveRepository;
    private readonly otRepository;
    private readonly outsideWorkRepository;
    constructor(employeeModel: Model<EmployeeDocument>, branchModel: Model<BranchDocument>, attendanceRepository: AttendanceRepository, leaveRepository: LeaveRepository, otRepository: OTRepository, outsideWorkRepository: OutsideWorkRepository);
    countEmployees(tenantId: Types.ObjectId): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
    countTodayCheckIns(tenantId: Types.ObjectId): Promise<number>;
    countPendingRequests(tenantId: Types.ObjectId): Promise<{
        leave: number;
        ot: number;
        outsideWork: number;
    }>;
    countBranches(tenantId: Types.ObjectId): Promise<{
        total: number;
        active: number;
    }>;
    findRecentEmployees(tenantId: Types.ObjectId, limit?: number): Promise<RecentEmployeeDto[]>;
    getMonthlySummary(tenantId: Types.ObjectId): Promise<MonthlyLeaveOtSummaryDto[]>;
}
