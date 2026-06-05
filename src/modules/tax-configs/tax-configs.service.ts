import { Injectable, NotFoundException } from '@nestjs/common';
import { TaxConfigsRepository } from './tax-configs.repository';
import { CompanyTaxConfigsRepository } from './company-tax-configs.repository';
import { CreateTaxConfigDto } from './dto/create-tax-config.dto';
import { UpsertCompanyTaxConfigDto } from './dto/upsert-company-tax-config.dto';
import { TaxMode } from './schemas/company-tax-config.schema';

@Injectable()
export class TaxConfigsService {
  constructor(
    private readonly taxConfigsRepository: TaxConfigsRepository,
    private readonly companyTaxConfigsRepository: CompanyTaxConfigsRepository,
  ) {}

  async create(dto: CreateTaxConfigDto) {
    return this.taxConfigsRepository.create(dto);
  }

  async findAll() {
    return this.taxConfigsRepository.findAll();
  }

  async findCurrent() {
    const config = await this.taxConfigsRepository.findCurrent();
    if (!config) throw new NotFoundException('No active tax configuration found');
    return config;
  }

  async update(id: string, dto: Partial<CreateTaxConfigDto>) {
    const existing = await this.taxConfigsRepository.findById(id);
    if (!existing) throw new NotFoundException('Tax config not found');
    const updateData: Partial<import('./schemas/tax-config.schema').TaxConfig> = {
      ...dto,
      effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
    };
    return this.taxConfigsRepository.update(id, updateData);
  }

  // BE-4: auto-create default if tenant has no config
  async getCompanyConfig(tenantId: string) {
    const existing = await this.companyTaxConfigsRepository.findByTenant(tenantId);
    if (existing) return existing;

    const globalConfig = await this.taxConfigsRepository.findCurrent();
    if (!globalConfig) throw new NotFoundException('No active tax configuration found');

    return this.companyTaxConfigsRepository.createDefault(
      tenantId,
      (globalConfig._id as import('mongoose').Types.ObjectId).toString(),
    );
  }

  async upsertCompanyConfig(tenantId: string, dto: UpsertCompanyTaxConfigDto, updatedBy: string) {
    if (!dto.taxConfigId) {
      const globalConfig = await this.taxConfigsRepository.findCurrent();
      if (!globalConfig) throw new NotFoundException('No active tax configuration found');
      dto.taxConfigId = (globalConfig._id as import('mongoose').Types.ObjectId).toString();
    }
    return this.companyTaxConfigsRepository.upsertByTenant(tenantId, dto, updatedBy);
  }

  async getAllCompanyConfigs() {
    return this.companyTaxConfigsRepository.findAll();
  }

  // Resolve effective tax rates based on taxMode — used by payroll
  resolveEffectiveRates(
    taxMode: TaxMode,
    enableEmployeeSs: boolean,
    enableIncomeTax: boolean,
    baseEmployeeSsRate: number,
    baseEmployerSsRate: number,
  ) {
    const effectiveEmployeeSsRate = enableEmployeeSs ? baseEmployeeSsRate : 0;
    const effectiveEmployerSsRate = baseEmployerSsRate; // employer SS not affected by enableEmployeeSs
    const applyIncomeTax = enableIncomeTax && taxMode !== TaxMode.NO_DEDUCTION && taxMode !== TaxMode.SS_ONLY;
    const taxOnCompany = taxMode === TaxMode.TAX_ON_COMPANY;
    const noDeduction = taxMode === TaxMode.NO_DEDUCTION;

    return { effectiveEmployeeSsRate, effectiveEmployerSsRate, applyIncomeTax, taxOnCompany, noDeduction };
  }
}
