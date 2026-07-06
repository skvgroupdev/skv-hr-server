import { Controller, Post, Get, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { OutsideWorkService } from './outside-work.service';
import { CreateOutsideWorkDto } from './dto/create-outside-work.dto';
import { ApproveOutsideWorkDto, RejectOutsideWorkDto } from './dto/approve-outside-work.dto';
import { OutsideWorkQueryDto } from './dto/outside-work-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { RequireFeatures } from '../../common/decorators/require-features.decorator';

@Controller('outside-work')
@UseGuards(RolesGuard)
@RequireFeatures('outsideWork')
export class OutsideWorkController {
  constructor(private readonly outsideWorkService: OutsideWorkService) {}

  @Post('request')
  @Roles('STAFF', 'SUPERVISOR', 'BRANCH_MANAGER', 'HR_ADMIN', 'COMPANY_OWNER')
  async request(@Body() dto: CreateOutsideWorkDto, @CurrentUser() user: JwtPayload) {
    const item = await this.outsideWorkService.request(user.companyId!, user.sub, dto);
    return { data: item };
  }

  @Get('my')
  async getMy(@Query() query: OutsideWorkQueryDto, @CurrentUser() user: JwtPayload) {
    return this.outsideWorkService.getMy(user.companyId!, user.sub, query);
  }

  @Get('pending')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR')
  async getPending(@CurrentUser() user: JwtPayload) {
    const items = await this.outsideWorkService.getPending(user.companyId!);
    return { data: items };
  }

  @Get('report')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getReport(@Query() query: OutsideWorkQueryDto, @CurrentUser() user: JwtPayload) {
    return this.outsideWorkService.getReport(user.companyId!, query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const item = await this.outsideWorkService.getOne(user.companyId!, id);
    return { data: item };
  }

  @Post(':id/approve')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async approve(@Param('id') id: string, @Body() dto: ApproveOutsideWorkDto, @CurrentUser() user: JwtPayload) {
    const item = await this.outsideWorkService.approve(user.companyId!, id, user.sub, dto);
    return { data: item };
  }

  @Post(':id/reject')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async reject(@Param('id') id: string, @Body() dto: RejectOutsideWorkDto, @CurrentUser() user: JwtPayload) {
    const item = await this.outsideWorkService.reject(user.companyId!, id, user.sub, dto);
    return { data: item };
  }
}
