import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { AdjustAttendanceDto } from './dto/adjust-attendance.dto';
import { AttendanceHistoryQueryDto, AttendanceReportQueryDto } from './dto/attendance-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('attendance')
@UseGuards(RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  async checkIn(@Body() dto: CheckInDto, @CurrentUser() user: JwtPayload) {
    const result = await this.attendanceService.checkIn(user.companyId!, user.sub, dto);
    return { data: result };
  }

  @Post('check-out')
  async checkOut(@Body() dto: CheckOutDto, @CurrentUser() user: JwtPayload) {
    const result = await this.attendanceService.checkOut(user.companyId!, user.sub, dto);
    return { data: result };
  }

  @Get('my-today')
  async getMyToday(@CurrentUser() user: JwtPayload) {
    const logs = await this.attendanceService.getMyToday(user.companyId!, user.sub);
    return { data: logs };
  }

  @Get('my-history')
  async getMyHistory(@Query() query: AttendanceHistoryQueryDto, @CurrentUser() user: JwtPayload) {
    return this.attendanceService.getMyHistory(user.companyId!, user.sub, query);
  }

  @Get('report/daily')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getDailyReport(@Query() query: AttendanceReportQueryDto, @CurrentUser() user: JwtPayload) {
    const logs = await this.attendanceService.getDailyReport(user.companyId!, query);
    return { data: logs };
  }

  @Get('report/monthly')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getMonthlyReport(@Query() query: AttendanceReportQueryDto, @CurrentUser() user: JwtPayload) {
    const logs = await this.attendanceService.getMonthlyReport(user.companyId!, query);
    return { data: logs };
  }

  @Get('report/late')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getLateReport(@Query() query: AttendanceReportQueryDto, @CurrentUser() user: JwtPayload) {
    const logs = await this.attendanceService.getLateReport(user.companyId!, query);
    return { data: logs };
  }

  @Get('report/absent')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getAbsentReport(@Query() query: AttendanceReportQueryDto, @CurrentUser() user: JwtPayload) {
    const logs = await this.attendanceService.getAbsentReport(user.companyId!, query);
    return { data: logs };
  }

  @Get('report/summary')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getSummary(@Query('date') dateStr: string, @CurrentUser() user: JwtPayload) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const data = await this.attendanceService.getSummary(user.companyId!, date);
    return { data };
  }

  @Get('report/not-checked-in')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getNotCheckedIn(@Query() query: AttendanceReportQueryDto, @CurrentUser() user: JwtPayload) {
    const data = await this.attendanceService.getNotCheckedInReport(user.companyId!, query);
    return { data };
  }

  @Get(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const log = await this.attendanceService.getOne(user.companyId!, id);
    return { data: log };
  }

  @Patch(':id/adjust')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async adjust(
    @Param('id') id: string,
    @Body() dto: AdjustAttendanceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const log = await this.attendanceService.manualAdjust(user.companyId!, id, user.sub, dto);
    return { data: log };
  }
}
