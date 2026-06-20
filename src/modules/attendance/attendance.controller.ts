import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { AdjustAttendanceDto } from './dto/adjust-attendance.dto';
import {
  AttendanceHistoryQueryDto,
  AttendanceReportQueryDto,
  EmployeeMonthlyReportQueryDto,
} from './dto/attendance-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { RequireFeatures } from '../../common/decorators/require-features.decorator';

@Controller('attendance')
@UseGuards(RolesGuard)
@RequireFeatures('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  async checkIn(@Body() dto: CheckInDto, @CurrentUser() user: JwtPayload) {
    const result = await this.attendanceService.checkIn(
      user.companyId!,
      user.sub,
      dto,
    );
    return { data: result };
  }

  @Post('check-out')
  async checkOut(@Body() dto: CheckOutDto, @CurrentUser() user: JwtPayload) {
    const result = await this.attendanceService.checkOut(
      user.companyId!,
      user.sub,
      dto,
    );
    return { data: result };
  }

  @Get('my-today')
  async getMyToday(@CurrentUser() user: JwtPayload) {
    const logs = await this.attendanceService.getMyToday(
      user.companyId!,
      user.sub,
    );
    return { data: logs };
  }

  @Get('my-history')
  async getMyHistory(
    @Query() query: AttendanceHistoryQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.attendanceService.getMyHistory(
      user.companyId!,
      user.sub,
      query,
    );
  }

  @Get('report/daily')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getDailyReport(
    @Query() query: AttendanceReportQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const logs = await this.attendanceService.getDailyReport(
      user.companyId!,
      scopeQuery(user, query),
    );
    return { data: logs };
  }

  @Get('report/monthly')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getMonthlyReport(
    @Query() query: AttendanceReportQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const logs = await this.attendanceService.getMonthlyReport(
      user.companyId!,
      scopeQuery(user, query),
    );
    return { data: logs };
  }

  @Get('report/late')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getLateReport(
    @Query() query: AttendanceReportQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const logs = await this.attendanceService.getLateReport(
      user.companyId!,
      query,
    );
    return { data: logs };
  }

  @Get('report/absent')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getAbsentReport(
    @Query() query: AttendanceReportQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const logs = await this.attendanceService.getAbsentReport(
      user.companyId!,
      query,
    );
    return { data: logs };
  }

  @Get('report/summary')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getSummary(
    @Query('date') dateStr: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const data = await this.attendanceService.getSummary(
      user.companyId!,
      date,
      branchScope(user),
    );
    return { data };
  }

  @Get('report/not-checked-in')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getNotCheckedIn(
    @Query() query: AttendanceReportQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const data = await this.attendanceService.getNotCheckedInReport(
      user.companyId!,
      scopeQuery(user, query),
    );
    return { data };
  }

  @Get('report/employee/:employeeId/monthly')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getEmployeeMonthlyReport(
    @Param('employeeId') employeeId: string,
    @Query() query: EmployeeMonthlyReportQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const year = parseInt(query.year, 10);
    const month = parseInt(query.month, 10);
    const data = await this.attendanceService.getEmployeeMonthlyReport(
      user.companyId!,
      employeeId,
      year,
      month,
      branchScope(user),
    );
    return { data };
  }

  @Get(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const log = await this.attendanceService.getOne(
      user.companyId!,
      id,
      branchScope(user),
    );
    return { data: log };
  }

  @Patch(':id/adjust')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async adjust(
    @Param('id') id: string,
    @Body() dto: AdjustAttendanceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const log = await this.attendanceService.manualAdjust(
      user.companyId!,
      id,
      user.sub,
      dto,
    );
    return { data: log };
  }
}

function branchScope(user: JwtPayload): string | undefined {
  if (user.role !== 'BRANCH_MANAGER') return undefined;
  if (!user.branchId)
    throw new ForbiddenException('Branch assignment is required');
  return user.branchId;
}

function scopeQuery(
  user: JwtPayload,
  query: AttendanceReportQueryDto,
): AttendanceReportQueryDto {
  const branchId = branchScope(user);
  return branchId ? { ...query, branchId } : query;
}
