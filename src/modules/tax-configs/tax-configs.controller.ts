import { Controller, Post, Get, Patch, Put, Body, Param, UseGuards } from '@nestjs/common';
import { TaxConfigsService } from './tax-configs.service';
import { CreateTaxConfigDto } from './dto/create-tax-config.dto';
import { UpsertCompanyTaxConfigDto } from './dto/upsert-company-tax-config.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

interface JwtUser {
  sub: string;
  role: string;
  companyId: string | null;
}

@Controller('tax-configs')
@UseGuards(RolesGuard)
export class TaxConfigsController {
  constructor(private readonly taxConfigsService: TaxConfigsService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  async create(@Body() dto: CreateTaxConfigDto) {
    const config = await this.taxConfigsService.create(dto);
    return { data: config };
  }

  @Get()
  @Roles('SUPER_ADMIN', 'COMPANY_OWNER')
  async findAll() {
    const configs = await this.taxConfigsService.findAll();
    return { data: configs };
  }

  @Get('current')
  async findCurrent() {
    const config = await this.taxConfigsService.findCurrent();
    return { data: config };
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateTaxConfigDto>) {
    const config = await this.taxConfigsService.update(id, dto);
    return { data: config };
  }

  // Per-tenant company tax config endpoints
  @Get('company')
  @Roles('COMPANY_OWNER', 'SUPER_ADMIN')
  async getCompanyConfig(@CurrentUser() user: JwtUser) {
    const tenantId = user.companyId!;
    const config = await this.taxConfigsService.getCompanyConfig(tenantId);
    return { data: config };
  }

  @Put('company')
  @Roles('COMPANY_OWNER', 'SUPER_ADMIN')
  async upsertCompanyConfig(@CurrentUser() user: JwtUser, @Body() dto: UpsertCompanyTaxConfigDto) {
    const tenantId = user.companyId!;
    const config = await this.taxConfigsService.upsertCompanyConfig(tenantId, dto, user.sub);
    return { data: config };
  }

  @Get('companies')
  @Roles('SUPER_ADMIN')
  async getAllCompanyConfigs() {
    const configs = await this.taxConfigsService.getAllCompanyConfigs();
    return { data: configs };
  }

  @Put('companies/:tenantId')
  @Roles('SUPER_ADMIN')
  async upsertCompanyConfigByAdmin(
    @Param('tenantId') tenantId: string,
    @Body() dto: UpsertCompanyTaxConfigDto,
    @CurrentUser() user: JwtUser,
  ) {
    const config = await this.taxConfigsService.upsertCompanyConfig(tenantId, dto, user.sub);
    return { data: config };
  }
}
