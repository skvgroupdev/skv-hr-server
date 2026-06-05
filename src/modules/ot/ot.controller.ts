import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { OTService } from './ot.service';
import { CreateOTRequestDto } from './dto/create-ot-request.dto';
import { UpdateOTPolicyDto } from './dto/update-ot-policy.dto';
import { ApproveOTDto, RejectOTDto } from './dto/approve-ot.dto';
import { OTQueryDto } from './dto/ot-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('ot')
@UseGuards(RolesGuard)
export class OTController {
  constructor(private readonly otService: OTService) {}

  @Get('policy')
  async getPolicy(@CurrentUser() user: JwtPayload) {
    const policy = await this.otService.getPolicy(user.companyId!);
    return { data: policy };
  }

  @Patch('policy')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async updatePolicy(@Body() dto: UpdateOTPolicyDto, @CurrentUser() user: JwtPayload) {
    const policy = await this.otService.updatePolicy(user.companyId!, dto);
    return { data: policy };
  }

  @Post('request')
  async request(@Body() dto: CreateOTRequestDto, @CurrentUser() user: JwtPayload) {
    const ot = await this.otService.request(user.companyId!, user.sub, dto);
    return { data: ot };
  }

  @Get('my')
  async getMy(@Query() query: OTQueryDto, @CurrentUser() user: JwtPayload) {
    return this.otService.getMy(user.companyId!, user.sub, query);
  }

  @Get('pending')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR')
  async getPending(@CurrentUser() user: JwtPayload) {
    const items = await this.otService.getPending(user.companyId!);
    return { data: items };
  }

  @Get('report')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getReport(@Query() query: OTQueryDto, @CurrentUser() user: JwtPayload) {
    return this.otService.getReport(user.companyId!, query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const ot = await this.otService.getOne(user.companyId!, id);
    return { data: ot };
  }

  @Post(':id/approve')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR')
  @HttpCode(HttpStatus.OK)
  async approve(@Param('id') id: string, @Body() dto: ApproveOTDto, @CurrentUser() user: JwtPayload) {
    const ot = await this.otService.approve(user.companyId!, id, user.sub, user.role, dto);
    return { data: ot };
  }

  @Post(':id/reject')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR')
  @HttpCode(HttpStatus.OK)
  async reject(@Param('id') id: string, @Body() dto: RejectOTDto, @CurrentUser() user: JwtPayload) {
    const ot = await this.otService.reject(user.companyId!, id, user.sub, user.role, dto);
    return { data: ot };
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const ot = await this.otService.cancel(user.companyId!, id, user.sub);
    return { data: ot };
  }
}
