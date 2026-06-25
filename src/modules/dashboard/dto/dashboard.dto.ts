export interface EmployeeSummaryDto {
  total: number;
  active: number;
  inactive: number;
}

export interface BranchSummaryDto {
  total: number;
  active: number;
}

export interface PendingRequestsDto {
  leave: number;
  ot: number;
  outsideWork: number;
}

export interface RecentEmployeeDto {
  id: string;
  firstName: string;
  lastName: string;
  employeeCode?: string;
  status: string;
  branch: string;
  position: string;
  createdAt: Date;
}

export interface MonthlyLeaveOtSummaryDto {
  month: number;
  approvedLeave: number;
  approvedOt: number;
  otHours: number;
}

export interface DashboardDto {
  employees: EmployeeSummaryDto;
  todayCheckIns: number;
  pendingRequests: PendingRequestsDto;
  branches: BranchSummaryDto;
  recentEmployees: RecentEmployeeDto[];
  monthlySummary: MonthlyLeaveOtSummaryDto[];
}
