import { Test, TestingModule } from '@nestjs/testing';
import { TaxCalculationService } from '../tax-calculation.service';
import type { TaxBracket } from '../schemas/tax-config.schema';

const LAO_PDR_2026_BRACKETS: TaxBracket[] = [
  { from: 0, to: 1300000, rate: 0.00 },
  { from: 1300001, to: 5000000, rate: 0.05 },
  { from: 5000001, to: 15000000, rate: 0.10 },
  { from: 15000001, to: 25000000, rate: 0.15 },
  { from: 25000001, to: 65000000, rate: 0.20 },
  { from: 65000001, to: null, rate: 0.24 },
];

const DEFAULT_OT_POLICY = { weekdayRate: 1.5, weekendRate: 2.0, holidayRate: 3.0 };

describe('TaxCalculationService', () => {
  let service: TaxCalculationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxCalculationService],
    }).compile();

    service = module.get<TaxCalculationService>(TaxCalculationService);
  });

  describe('calculateProgressiveTax', () => {
    it('should return 0 tax for income below 1,300,000 LAK', () => {
      const tax = service.calculateProgressiveTax(1000000, LAO_PDR_2026_BRACKETS);
      expect(tax).toBe(0);
    });

    it('should return 0 tax at exactly 1,300,000 LAK threshold', () => {
      const tax = service.calculateProgressiveTax(1300000, LAO_PDR_2026_BRACKETS);
      expect(tax).toBe(0);
    });

    it('should calculate 5% bracket correctly for 3,000,000 LAK', () => {
      // Taxable: 3,000,000. Zero bracket: 1,300,000. 5% bracket: 1,700,000 × 0.05 = 85,000
      const tax = service.calculateProgressiveTax(3000000, LAO_PDR_2026_BRACKETS);
      expect(tax).toBe(85000);
    });

    it('should calculate progressive tax correctly for 10,000,000 LAK income', () => {
      // 0 on first 1,300,000
      // 5% on 1,300,001 to 5,000,000 = 3,699,999 × 0.05 = 185,000 (approx)
      // 10% on 5,000,001 to 10,000,000 = 5,000,000 × 0.10 = 500,000 (approx)
      const tax = service.calculateProgressiveTax(10000000, LAO_PDR_2026_BRACKETS);
      expect(tax).toBeGreaterThan(500000);
      expect(tax).toBeLessThan(700000);
    });

    it('should calculate top bracket tax for 100,000,000 LAK income', () => {
      const tax = service.calculateProgressiveTax(100000000, LAO_PDR_2026_BRACKETS);
      expect(tax).toBeGreaterThan(0);
    });

    it('should return 0 for zero income', () => {
      const tax = service.calculateProgressiveTax(0, LAO_PDR_2026_BRACKETS);
      expect(tax).toBe(0);
    });
  });

  describe('calculateOTAmount', () => {
    it('should calculate weekday OT at 1.5x rate', () => {
      // hourly = 5,000,000 / 208 = ~24,038
      // OT for 2 hours = 24,038 × 2 × 1.5 = ~72,115
      const result = service.calculateOTAmount(5000000, 208, 2, 'weekday', DEFAULT_OT_POLICY);
      expect(result).toBeCloseTo(72115, -3);
    });

    it('should calculate weekend OT at 2.0x rate', () => {
      const result = service.calculateOTAmount(5000000, 208, 2, 'weekend', DEFAULT_OT_POLICY);
      expect(result).toBeCloseTo(96154, -3);
    });

    it('should calculate holiday OT at 3.0x rate', () => {
      const weekdayOT = service.calculateOTAmount(5000000, 208, 2, 'weekday', DEFAULT_OT_POLICY);
      const holidayOT = service.calculateOTAmount(5000000, 208, 2, 'holiday', DEFAULT_OT_POLICY);
      expect(holidayOT / weekdayOT).toBeCloseTo(2.0, 1); // holiday = 3x, weekday = 1.5x, ratio = 2
    });
  });

  describe('calculatePayroll', () => {
    it('should calculate full payroll correctly', () => {
      const result = service.calculatePayroll({
        baseSalary: 5000000,
        allowances: [{ name: 'Transport', amount: 300000 }],
        otHours: 4,
        otType: 'weekday',
        otPolicy: DEFAULT_OT_POLICY,
        workingHoursPerMonth: 208,
        employeeSsRate: 0.055,
        employerSsRate: 0.06,
        brackets: LAO_PDR_2026_BRACKETS,
        deductions: [],
      });

      expect(result.baseSalary).toBe(5000000);
      expect(result.allowancesTotal).toBe(300000);
      expect(result.otAmount).toBeGreaterThan(0);
      expect(result.grossSalary).toBeGreaterThan(5300000);
      expect(result.employeeSsAmount).toBeGreaterThan(0);
      expect(result.taxableIncome).toBeLessThan(result.grossSalary);
      expect(result.incomeTax).toBeGreaterThan(0);
      expect(result.netSalary).toBeLessThan(result.grossSalary);
      expect(result.employerSsAmount).toBeGreaterThan(0);
    });

    it('should deduct otherDeductions from net salary', () => {
      const withoutDeductions = service.calculatePayroll({
        baseSalary: 5000000,
        allowances: [],
        otHours: 0,
        otType: 'weekday',
        otPolicy: DEFAULT_OT_POLICY,
        workingHoursPerMonth: 208,
        employeeSsRate: 0.055,
        employerSsRate: 0.06,
        brackets: LAO_PDR_2026_BRACKETS,
        deductions: [],
      });

      const withDeductions = service.calculatePayroll({
        baseSalary: 5000000,
        allowances: [],
        otHours: 0,
        otType: 'weekday',
        otPolicy: DEFAULT_OT_POLICY,
        workingHoursPerMonth: 208,
        employeeSsRate: 0.055,
        employerSsRate: 0.06,
        brackets: LAO_PDR_2026_BRACKETS,
        deductions: [{ name: 'Loan', amount: 200000 }],
      });

      expect(withDeductions.netSalary).toBe(withoutDeductions.netSalary - 200000);
    });

    it('should calculate grossSalary = baseSalary + allowances + otAmount', () => {
      const result = service.calculatePayroll({
        baseSalary: 4000000,
        allowances: [{ name: 'Meal', amount: 200000 }],
        otHours: 0,
        otType: 'weekday',
        otPolicy: DEFAULT_OT_POLICY,
        workingHoursPerMonth: 208,
        employeeSsRate: 0.055,
        employerSsRate: 0.06,
        brackets: LAO_PDR_2026_BRACKETS,
        deductions: [],
      });

      expect(result.grossSalary).toBe(4200000);
    });

    it('should calculate employerSS separately from net salary', () => {
      const result = service.calculatePayroll({
        baseSalary: 5000000,
        allowances: [],
        otHours: 0,
        otType: 'weekday',
        otPolicy: DEFAULT_OT_POLICY,
        workingHoursPerMonth: 208,
        employeeSsRate: 0.055,
        employerSsRate: 0.06,
        brackets: LAO_PDR_2026_BRACKETS,
        deductions: [],
      });

      // employerSS should be 6% of gross, not subtracted from net
      expect(result.employerSsAmount).toBe(Math.round(result.grossSalary * 0.06));
      expect(result.netSalary).toBe(result.grossSalary - result.totalDeductions);
    });
  });
});
