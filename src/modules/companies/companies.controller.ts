import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { CompanyQueryDto } from './dto/company-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('super/companies')
@UseGuards(RolesGuard)
@Roles('SUPER_ADMIN')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() dto: CreateCompanyDto, @CurrentUser() user: JwtPayload) {
    const company = await this.companiesService.createCompany(dto, user.sub, user.role);
    return { data: company };
  }

  @Get()
  async list(@Query() query: CompanyQueryDto) {
    return this.companiesService.listCompanies(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const company = await this.companiesService.getCompany(id);
    return { data: company };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const company = await this.companiesService.updateCompany(id, dto, user.sub, user.role);
    return { data: company };
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const company = await this.companiesService.activateCompany(id, user.sub, user.role);
    return { data: company };
  }

  @Post(':id/suspend')
  @HttpCode(HttpStatus.OK)
  async suspend(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const company = await this.companiesService.suspendCompany(id, user.sub, user.role);
    return { data: company };
  }

  @Post(':id/create-owner')
  async createOwner(
    @Param('id') id: string,
    @Body() dto: CreateOwnerDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const owner = await this.companiesService.createOwner(id, dto, user.sub, user.role);
    return { data: owner };
  }

  @Post(':id/assign-plan')
  @HttpCode(HttpStatus.OK)
  async assignPlan(
    @Param('id') id: string,
    @Body() body: { planId: string; startDate: string; endDate: string; isPaid?: boolean },
    @CurrentUser() user: JwtPayload,
  ) {
    const company = await this.companiesService.assignPlan(
      id,
      body.planId,
      body.startDate,
      body.endDate,
      body.isPaid ?? false,
      user.sub,
    );
    return { data: company };
  }

  @Get(':id/usage')
  async getUsage(@Param('id') id: string) {
    const usage = await this.companiesService.getUsage(id);
    return { data: usage };
  }

  @Get('dashboard/stats')
  async getSuperDashboard() {
    const stats = await this.companiesService.getSuperDashboard();
    return { data: stats };
  }
}
