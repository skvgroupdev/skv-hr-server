import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportQueryDto } from './report-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('reports')
@UseGuards(RolesGuard)
@Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('attendance/daily')
  async getDailyAttendance(@Query() query: ReportQueryDto, @CurrentUser() user: JwtPayload) {
    const data = await this.reportsService.getDailyAttendance(user.companyId!, query);
    return { data };
  }

  @Get('attendance/monthly')
  async getMonthlyAttendance(@Query() query: ReportQueryDto, @CurrentUser() user: JwtPayload) {
    const data = await this.reportsService.getMonthlyAttendance(user.companyId!, query);
    return { data };
  }

  @Get('attendance/late')
  async getLateAttendance(@Query() query: ReportQueryDto, @CurrentUser() user: JwtPayload) {
    const data = await this.reportsService.getLateAttendance(user.companyId!, query);
    return { data };
  }

  @Get('attendance/absent')
  async getAbsentAttendance(@Query() query: ReportQueryDto, @CurrentUser() user: JwtPayload) {
    const data = await this.reportsService.getAbsentAttendance(user.companyId!, query);
    return { data };
  }

  @Get('attendance/missing-checkout')
  async getMissingCheckout(@Query() query: ReportQueryDto, @CurrentUser() user: JwtPayload) {
    const data = await this.reportsService.getMissingCheckout(user.companyId!, query);
    return { data };
  }

  @Get('leave/summary')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getLeaveSummary(@Query() query: ReportQueryDto, @CurrentUser() user: JwtPayload) {
    const data = await this.reportsService.getLeaveSummary(user.companyId!, query);
    return { data };
  }

  @Get('leave/balance')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getLeaveBalance(@Query() query: ReportQueryDto, @CurrentUser() user: JwtPayload) {
    const data = await this.reportsService.getLeaveBalance(user.companyId!, query);
    return { data };
  }

  @Get('ot/summary')
  async getOTSummary(@Query() query: ReportQueryDto, @CurrentUser() user: JwtPayload) {
    const data = await this.reportsService.getOTSummary(user.companyId!, query);
    return { data };
  }

  @Get('ot/cost')
  async getOTCost(@Query() query: ReportQueryDto, @CurrentUser() user: JwtPayload) {
    const data = await this.reportsService.getOTCost(user.companyId!, query);
    return { data };
  }
}
