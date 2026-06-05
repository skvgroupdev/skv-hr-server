import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { ApproveLeaveDto, RejectLeaveDto } from './dto/approve-leave.dto';
import { LeaveBalanceAdjustDto } from './dto/leave-balance-adjust.dto';
import { LeaveQueryDto } from './dto/leave-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller()
@UseGuards(RolesGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  // Leave Types
  @Post('leave-types')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async createLeaveType(@Body() dto: CreateLeaveTypeDto, @CurrentUser() user: JwtPayload) {
    const leaveType = await this.leaveService.createLeaveType(user.companyId!, dto);
    return { data: leaveType };
  }

  @Get('leave-types')
  async findAllLeaveTypes(@CurrentUser() user: JwtPayload) {
    const types = await this.leaveService.findAllLeaveTypes(user.companyId!);
    return { data: types };
  }

  @Patch('leave-types/:id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async updateLeaveType(
    @Param('id') id: string,
    @Body() dto: Partial<CreateLeaveTypeDto>,
    @CurrentUser() user: JwtPayload,
  ) {
    const leaveType = await this.leaveService.updateLeaveType(user.companyId!, id, dto);
    return { data: leaveType };
  }

  @Delete('leave-types/:id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async deleteLeaveType(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const leaveType = await this.leaveService.deleteLeaveType(user.companyId!, id);
    return { data: leaveType };
  }

  // Leave Requests
  @Post('leave/request')
  async request(@Body() dto: CreateLeaveRequestDto, @CurrentUser() user: JwtPayload) {
    const leave = await this.leaveService.request(user.companyId!, user.sub, dto);
    return { data: leave };
  }

  @Get('leave/my')
  async getMy(@Query() query: LeaveQueryDto, @CurrentUser() user: JwtPayload) {
    return this.leaveService.getMy(user.companyId!, user.sub, query);
  }

  @Get('leave/pending')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR')
  async getPending(@CurrentUser() user: JwtPayload) {
    const items = await this.leaveService.getPending(user.companyId!);
    return { data: items };
  }

  @Get('leave/report')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getReport(@Query() query: LeaveQueryDto, @CurrentUser() user: JwtPayload) {
    return this.leaveService.getReport(user.companyId!, query);
  }

  @Get('leave/balance/my')
  async getMyBalance(@CurrentUser() user: JwtPayload) {
    const balances = await this.leaveService.getMyBalance(user.companyId!, user.sub);
    return { data: balances };
  }

  @Get('leave/balance/:employeeId')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getEmployeeBalance(@Param('employeeId') employeeId: string, @CurrentUser() user: JwtPayload) {
    const balances = await this.leaveService.getEmployeeBalance(user.companyId!, employeeId);
    return { data: balances };
  }

  @Patch('leave/balance/:employeeId')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async adjustBalance(
    @Param('employeeId') employeeId: string,
    @Body() dto: LeaveBalanceAdjustDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const balance = await this.leaveService.adjustBalance(user.companyId!, employeeId, dto);
    return { data: balance };
  }

  @Get('leave/:id')
  async getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const leave = await this.leaveService.getOne(user.companyId!, id);
    return { data: leave };
  }

  @Post('leave/:id/approve')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR')
  @HttpCode(HttpStatus.OK)
  async approve(@Param('id') id: string, @Body() dto: ApproveLeaveDto, @CurrentUser() user: JwtPayload) {
    const leave = await this.leaveService.approve(user.companyId!, id, user.sub, user.role, dto);
    return { data: leave };
  }

  @Post('leave/:id/reject')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR')
  @HttpCode(HttpStatus.OK)
  async reject(@Param('id') id: string, @Body() dto: RejectLeaveDto, @CurrentUser() user: JwtPayload) {
    const leave = await this.leaveService.reject(user.companyId!, id, user.sub, user.role, dto);
    return { data: leave };
  }

  @Post('leave/:id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const leave = await this.leaveService.cancel(user.companyId!, id, user.sub);
    return { data: leave };
  }
}
