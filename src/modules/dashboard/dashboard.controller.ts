import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('dashboard')
@UseGuards(RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('today-overview')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR')
  async getTodayOverview(@CurrentUser() user: JwtPayload) {
    const data = await this.dashboardService.getTodayOverview(user);
    return { data };
  }

  @Get('pending-counts')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR')
  async getPendingCounts(@CurrentUser() user: JwtPayload) {
    const data = await this.dashboardService.getPendingCounts(user);
    return { data };
  }

  @Get()
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const data = await this.dashboardService.getDashboard(user);
    return { data };
  }
}
