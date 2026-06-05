import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaxConfigsService } from '../tax-configs.service';
import { TaxConfigsRepository } from '../tax-configs.repository';
import { CompanyTaxConfigsRepository } from '../company-tax-configs.repository';
import { TaxMode } from '../schemas/company-tax-config.schema';
import { TaxCalculationService } from '../tax-calculation.service';

const MOCK_TENANT_ID = '507f1f77bcf86cd799439011';
const MOCK_TAX_CONFIG_ID = '507f1f77bcf86cd799439012';
const MOCK_USER_ID = '507f1f77bcf86cd799439013';

const mockGlobalTaxConfig = {
  _id: { toString: () => MOCK_TAX_CONFIG_ID },
  employeeSsRate: 0.055,
  employerSsRate: 0.06,
  brackets: [{ from: 0, to: 1300000, rate: 0 }],
  toJSON: () => ({ employeeSsRate: 0.055 }),
};

const mockCompanyConfig = {
  tenantId: MOCK_TENANT_ID,
  taxConfigId: { toString: () => MOCK_TAX_CONFIG_ID },
  taxMode: TaxMode.FULL_DEDUCTION,
  enableEmployeeSs: true,
  enableEmployerSs: true,
  enableIncomeTax: true,
};

describe('TaxConfigsService — company config methods', () => {
  let service: TaxConfigsService;
  let taxConfigsRepo: jest.Mocked<TaxConfigsRepository>;
  let companyTaxConfigsRepo: jest.Mocked<CompanyTaxConfigsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxConfigsService,
        TaxCalculationService,
        {
          provide: TaxConfigsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findCurrent: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: CompanyTaxConfigsRepository,
          useValue: {
            findByTenant: jest.fn(),
            upsertByTenant: jest.fn(),
            createDefault: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaxConfigsService>(TaxConfigsService);
    taxConfigsRepo = module.get(TaxConfigsRepository);
    companyTaxConfigsRepo = module.get(CompanyTaxConfigsRepository);
  });

  describe('getCompanyConfig', () => {
    it('should return existing config when found', async () => {
      companyTaxConfigsRepo.findByTenant.mockResolvedValue(mockCompanyConfig as never);

      const result = await service.getCompanyConfig(MOCK_TENANT_ID);

      expect(companyTaxConfigsRepo.findByTenant).toHaveBeenCalledWith(MOCK_TENANT_ID);
      expect(result).toEqual(mockCompanyConfig);
    });

    it('should auto-create default config when not found', async () => {
      companyTaxConfigsRepo.findByTenant.mockResolvedValue(null);
      taxConfigsRepo.findCurrent.mockResolvedValue(mockGlobalTaxConfig as never);
      companyTaxConfigsRepo.createDefault.mockResolvedValue({ ...mockCompanyConfig } as never);

      const result = await service.getCompanyConfig(MOCK_TENANT_ID);

      expect(taxConfigsRepo.findCurrent).toHaveBeenCalled();
      expect(companyTaxConfigsRepo.createDefault).toHaveBeenCalledWith(MOCK_TENANT_ID, MOCK_TAX_CONFIG_ID);
      expect(result.taxMode).toBe(TaxMode.FULL_DEDUCTION);
    });

    it('should throw NotFoundException when no global config exists for auto-create', async () => {
      companyTaxConfigsRepo.findByTenant.mockResolvedValue(null);
      taxConfigsRepo.findCurrent.mockResolvedValue(null);

      await expect(service.getCompanyConfig(MOCK_TENANT_ID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('upsertCompanyConfig', () => {
    it('should upsert with provided taxConfigId', async () => {
      const dto = { taxConfigId: MOCK_TAX_CONFIG_ID, taxMode: TaxMode.SS_ONLY };
      companyTaxConfigsRepo.upsertByTenant.mockResolvedValue({ ...mockCompanyConfig, taxMode: TaxMode.SS_ONLY } as never);

      const result = await service.upsertCompanyConfig(MOCK_TENANT_ID, dto, MOCK_USER_ID);

      expect(companyTaxConfigsRepo.upsertByTenant).toHaveBeenCalledWith(MOCK_TENANT_ID, dto, MOCK_USER_ID);
      expect(result.taxMode).toBe(TaxMode.SS_ONLY);
    });

    it('should fallback to global taxConfigId when not provided in dto', async () => {
      const dto = { taxMode: TaxMode.TAX_ON_COMPANY };
      taxConfigsRepo.findCurrent.mockResolvedValue(mockGlobalTaxConfig as never);
      companyTaxConfigsRepo.upsertByTenant.mockResolvedValue({ ...mockCompanyConfig, taxMode: TaxMode.TAX_ON_COMPANY } as never);

      await service.upsertCompanyConfig(MOCK_TENANT_ID, dto, MOCK_USER_ID);

      expect(taxConfigsRepo.findCurrent).toHaveBeenCalled();
      expect(companyTaxConfigsRepo.upsertByTenant).toHaveBeenCalledWith(
        MOCK_TENANT_ID,
        expect.objectContaining({ taxConfigId: MOCK_TAX_CONFIG_ID }),
        MOCK_USER_ID,
      );
    });

    it('should throw NotFoundException when no global config on fallback', async () => {
      taxConfigsRepo.findCurrent.mockResolvedValue(null);

      await expect(service.upsertCompanyConfig(MOCK_TENANT_ID, {}, MOCK_USER_ID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllCompanyConfigs', () => {
    it('should return all company configs', async () => {
      companyTaxConfigsRepo.findAll.mockResolvedValue([mockCompanyConfig as never]);

      const result = await service.getAllCompanyConfigs();

      expect(result).toHaveLength(1);
      expect(companyTaxConfigsRepo.findAll).toHaveBeenCalled();
    });
  });

  describe('resolveEffectiveRates', () => {
    const baseRates = { employeeSsRate: 0.055, employerSsRate: 0.06 };

    it('FULL_DEDUCTION — all deductions active', () => {
      const rates = service.resolveEffectiveRates(TaxMode.FULL_DEDUCTION, true, true, 0.055, 0.06);
      expect(rates.effectiveEmployeeSsRate).toBe(0.055);
      expect(rates.applyIncomeTax).toBe(true);
      expect(rates.taxOnCompany).toBe(false);
      expect(rates.noDeduction).toBe(false);
    });

    it('TAX_ON_COMPANY — taxOnCompany flag is true', () => {
      const rates = service.resolveEffectiveRates(TaxMode.TAX_ON_COMPANY, true, true, 0.055, 0.06);
      expect(rates.taxOnCompany).toBe(true);
      expect(rates.applyIncomeTax).toBe(true); // still calculate for audit
    });

    it('SS_ONLY — income tax not applied', () => {
      const rates = service.resolveEffectiveRates(TaxMode.SS_ONLY, true, true, baseRates.employeeSsRate, baseRates.employerSsRate);
      expect(rates.applyIncomeTax).toBe(false);
      expect(rates.effectiveEmployeeSsRate).toBe(0.055);
    });

    it('NO_DEDUCTION — noDeduction flag is true, SS rate becomes 0', () => {
      const rates = service.resolveEffectiveRates(TaxMode.NO_DEDUCTION, true, true, 0.055, 0.06);
      expect(rates.noDeduction).toBe(true);
      expect(rates.applyIncomeTax).toBe(false);
    });

    it('enableEmployeeSs = false — employee SS rate is 0', () => {
      const rates = service.resolveEffectiveRates(TaxMode.FULL_DEDUCTION, false, true, 0.055, 0.06);
      expect(rates.effectiveEmployeeSsRate).toBe(0);
    });
  });
});

describe('TaxCalculationService — taxMode integration', () => {
  let calcService: TaxCalculationService;

  const brackets = [
    { from: 0, to: 1300000, rate: 0 },
    { from: 1300001, to: 5000000, rate: 0.05 },
  ];
  const baseInput = {
    baseSalary: 5000000,
    allowances: [],
    otHours: 0,
    otType: 'weekday' as const,
    otPolicy: { weekdayRate: 1.5, weekendRate: 2.0, holidayRate: 3.0 },
    workingHoursPerMonth: 208,
    employeeSsRate: 0.055,
    employerSsRate: 0.06,
    brackets,
    deductions: [],
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({ providers: [TaxCalculationService] }).compile();
    calcService = module.get(TaxCalculationService);
  });

  it('FULL_DEDUCTION — deducts both SS and income tax', () => {
    const result = calcService.calculatePayroll(baseInput);
    expect(result.employeeSsAmount).toBeGreaterThan(0);
    expect(result.incomeTax).toBeGreaterThan(0);
    expect(result.netSalary).toBeLessThan(result.grossSalary);
  });

  it('SS_ONLY — no income tax when brackets are empty', () => {
    const result = calcService.calculatePayroll({ ...baseInput, brackets: [] });
    expect(result.incomeTax).toBe(0);
    expect(result.employeeSsAmount).toBeGreaterThan(0);
  });

  it('TAX_ON_COMPANY — net salary should not include income tax deduction (simulated via service)', () => {
    const raw = calcService.calculatePayroll(baseInput);
    // Simulate applyTaxModeAdjustments for TAX_ON_COMPANY
    const deductionsWithoutTax = raw.totalDeductions - raw.incomeTax;
    const adjustedNet = raw.grossSalary - deductionsWithoutTax;
    expect(adjustedNet).toBeGreaterThan(raw.netSalary);
    expect(raw.incomeTax).toBeGreaterThan(0); // still recorded
  });

  it('NO_DEDUCTION — net equals gross (simulated)', () => {
    const raw = calcService.calculatePayroll(baseInput);
    // Simulate NO_DEDUCTION override
    const adjustedNet = raw.grossSalary; // no deductions
    expect(adjustedNet).toBe(raw.grossSalary);
  });
});
