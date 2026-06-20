"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxConfigsService = void 0;
const common_1 = require("@nestjs/common");
const tax_configs_repository_1 = require("./tax-configs.repository");
const company_tax_configs_repository_1 = require("./company-tax-configs.repository");
const company_tax_config_schema_1 = require("./schemas/company-tax-config.schema");
let TaxConfigsService = class TaxConfigsService {
    taxConfigsRepository;
    companyTaxConfigsRepository;
    constructor(taxConfigsRepository, companyTaxConfigsRepository) {
        this.taxConfigsRepository = taxConfigsRepository;
        this.companyTaxConfigsRepository = companyTaxConfigsRepository;
    }
    async create(dto) {
        return this.taxConfigsRepository.create(dto);
    }
    async findAll() {
        return this.taxConfigsRepository.findAll();
    }
    async findCurrent() {
        const config = await this.taxConfigsRepository.findCurrent();
        if (!config)
            throw new common_1.NotFoundException('No active tax configuration found');
        return config;
    }
    async update(id, dto) {
        const existing = await this.taxConfigsRepository.findById(id);
        if (!existing)
            throw new common_1.NotFoundException('Tax config not found');
        const updateData = {
            ...dto,
            effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
        };
        return this.taxConfigsRepository.update(id, updateData);
    }
    async getOrCreateGlobalConfig() {
        const existing = await this.taxConfigsRepository.findCurrent();
        if (existing)
            return existing;
        return this.taxConfigsRepository.create({
            country: 'LA',
            year: new Date().getFullYear(),
            currency: 'LAK',
            brackets: [
                { from: 0, to: 1300000, rate: 0 },
                { from: 1300001, to: 5000000, rate: 0.05 },
                { from: 5000001, to: 15000000, rate: 0.10 },
                { from: 15000001, to: 25000000, rate: 0.12 },
                { from: 25000001, to: 65000000, rate: 0.15 },
                { from: 65000001, to: null, rate: 0.20 },
            ],
            employeeSsRate: 0.055,
            employerSsRate: 0.06,
            effectiveFrom: '2024-01-01',
        });
    }
    async getCompanyConfig(tenantId) {
        const existing = await this.companyTaxConfigsRepository.findByTenant(tenantId);
        if (existing)
            return existing;
        const globalConfig = await this.getOrCreateGlobalConfig();
        return this.companyTaxConfigsRepository.createDefault(tenantId, globalConfig._id.toString());
    }
    async upsertCompanyConfig(tenantId, dto, updatedBy) {
        if (!dto.taxConfigId) {
            const globalConfig = await this.getOrCreateGlobalConfig();
            dto.taxConfigId = globalConfig._id.toString();
        }
        return this.companyTaxConfigsRepository.upsertByTenant(tenantId, dto, updatedBy);
    }
    async getAllCompanyConfigs() {
        return this.companyTaxConfigsRepository.findAll();
    }
    resolveEffectiveRates(taxMode, enableEmployeeSs, enableIncomeTax, baseEmployeeSsRate, baseEmployerSsRate) {
        const effectiveEmployeeSsRate = enableEmployeeSs ? baseEmployeeSsRate : 0;
        const effectiveEmployerSsRate = baseEmployerSsRate;
        const applyIncomeTax = enableIncomeTax && taxMode !== company_tax_config_schema_1.TaxMode.NO_DEDUCTION && taxMode !== company_tax_config_schema_1.TaxMode.SS_ONLY;
        const taxOnCompany = taxMode === company_tax_config_schema_1.TaxMode.TAX_ON_COMPANY;
        const noDeduction = taxMode === company_tax_config_schema_1.TaxMode.NO_DEDUCTION;
        return { effectiveEmployeeSsRate, effectiveEmployerSsRate, applyIncomeTax, taxOnCompany, noDeduction };
    }
};
exports.TaxConfigsService = TaxConfigsService;
exports.TaxConfigsService = TaxConfigsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tax_configs_repository_1.TaxConfigsRepository,
        company_tax_configs_repository_1.CompanyTaxConfigsRepository])
], TaxConfigsService);
//# sourceMappingURL=tax-configs.service.js.map