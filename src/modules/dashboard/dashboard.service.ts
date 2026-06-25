import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DashboardRepository } from './dashboard.repository';
import type { DashboardDto } from './dto/dashboard.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getTodayOverview(currentUser: JwtPayload) {
    const tenantId = new Types.ObjectId(currentUser.companyId!);
    return this.dashboardRepository.getTodayOverview(tenantId, new Date());
  }

  async getPendingCounts(currentUser: JwtPayload): Promise<{ leave: number; ot: number; outsideWork: number }> {
    const tenantId = new Types.ObjectId(currentUser.companyId!);
    return this.dashboardRepository.countPendingRequests(tenantId);
  }

  async getDashboard(currentUser: JwtPayload): Promise<DashboardDto> {
    const tenantId = new Types.ObjectId(currentUser.companyId!);

    const [employees, todayCheckIns, pendingRequests, branches, recentEmployees, monthlySummary] =
      await Promise.all([
        this.dashboardRepository.countEmployees(tenantId),
        this.dashboardRepository.countTodayCheckIns(tenantId),
        this.dashboardRepository.countPendingRequests(tenantId),
        this.dashboardRepository.countBranches(tenantId),
        this.dashboardRepository.findRecentEmployees(tenantId, 5),
        this.dashboardRepository.getMonthlySummary(tenantId),
      ]);

    return { employees, todayCheckIns, pendingRequests, branches, recentEmployees, monthlySummary };
  }
}
