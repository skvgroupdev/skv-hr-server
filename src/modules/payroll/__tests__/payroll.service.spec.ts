import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { PayrollService } from '../payroll.service';
import { PayrollRepository } from '../payroll.repository';
import { TaxCalculationService } from '../../tax-configs/tax-calculation.service';
import { TaxConfigsRepository } from '../../tax-configs/tax-configs.repository';
import { TaxConfigsService } from '../../tax-configs/tax-configs.service';
import { CompanyTaxConfigsRepository } from '../../tax-configs/company-tax-configs.repository';
import { EmployeesRepository } from '../../employees/employees.repository';
import { OTRepository } from '../../ot/ot.repository';

const makeId = () => new Types.ObjectId();

function makePayslip(overrides: Record<string, unknown> = {}) {
  return {
    _id: makeId(),
    tenantId: makeId(),
    employeeId: makeId(),
    payrollPeriodId: makeId(),
    netSalary: 30000,
    grossSalary: 35000,
    status: 'DRAFT',
    ...overrides,
  };
}

describe('PayrollService', () => {
  let service: PayrollService;

  const mockPayrollRepository = {
    createPeriod: jest.fn(),
    findPeriodById: jest.fn(),
    findPeriodsPaginated: jest.fn(),
    updatePeriod: jest.fn(),
    createPayslips: jest.fn(),
    findPayslipsByPeriod: jest.fn(),
    findMyPayslips: jest.fn(),
    findPayslipById: jest.fn(),
    findPayslipByEmployeeAndPeriod: jest.fn(),
    findAllPayslipsPaginated: jest.fn(),
    findPayslipsByEmployee: jest.fn(),
    getFinanceSummaryByEmployee: jest.fn(),
  };

  const mockTaxCalculationService = {
    calculatePayroll: jest.fn(),
  };

  const mockTaxConfigsRepository = {
    findCurrent: jest.fn(),
    findById: jest.fn(),
  };

  const mockTaxConfigsService = {
    resolveEffectiveRates: jest.fn().mockReturnValue({
      effectiveEmployeeSsRate: 0.055,
      effectiveEmployerSsRate: 0.06,
      applyIncomeTax: true,
      taxOnCompany: false,
      noDeduction: false,
    }),
  };

  const mockCompanyTaxConfigsRepository = {
    findByTenant: jest.fn().mockResolvedValue(null),
  };

  const mockEmployeesRepository = {
    findPaginated: jest.fn(),
    findById: jest.fn(),
  };

  const mockOTRepository = {
    findApprovedInDateRange: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayrollService,
        { provide: PayrollRepository, useValue: mockPayrollRepository },
        { provide: TaxCalculationService, useValue: mockTaxCalculationService },
        { provide: TaxConfigsRepository, useValue: mockTaxConfigsRepository },
        { provide: TaxConfigsService, useValue: mockTaxConfigsService },
        { provide: CompanyTaxConfigsRepository, useValue: mockCompanyTaxConfigsRepository },
        { provide: EmployeesRepository, useValue: mockEmployeesRepository },
        { provide: OTRepository, useValue: mockOTRepository },
      ],
    }).compile();

    service = module.get<PayrollService>(PayrollService);
    jest.clearAllMocks();
  });

  describe('getAllPayslips', () => {
    const tenantId = makeId().toString();

    it('should return paginated payslips without filters', async () => {
      const payslips = [makePayslip(), makePayslip()];
      mockPayrollRepository.findAllPayslipsPaginated.mockResolvedValue({ data: payslips, total: 2 });

      const result = await service.getAllPayslips(tenantId, { page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({ page: 1, limit: 20, total: 2, totalPages: 1 });
      expect(mockPayrollRepository.findAllPayslipsPaginated).toHaveBeenCalledWith(
        expect.any(Types.ObjectId),
        expect.objectContaining({ employeeIds: undefined }),
        1,
        20,
        '-createdAt',
      );
    });

    it('should apply periodId and status filters', async () => {
      const periodId = makeId().toString();
      const payslips = [makePayslip({ status: 'APPROVED' })];
      mockPayrollRepository.findAllPayslipsPaginated.mockResolvedValue({ data: payslips, total: 1 });

      const result = await service.getAllPayslips(tenantId, { periodId, status: 'APPROVED' });

      expect(mockPayrollRepository.findAllPayslipsPaginated).toHaveBeenCalledWith(
        expect.any(Types.ObjectId),
        expect.objectContaining({ periodId, status: 'APPROVED' }),
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
      );
      expect(result.data).toHaveLength(1);
    });

    it('should resolve employeeIds when search is provided', async () => {
      const employeeId = makeId();
      mockEmployeesRepository.findPaginated.mockResolvedValue({
        employees: [{ _id: employeeId }],
        total: 1,
      });
      mockPayrollRepository.findAllPayslipsPaginated.mockResolvedValue({ data: [], total: 0 });

      await service.getAllPayslips(tenantId, { search: 'John' });

      expect(mockEmployeesRepository.findPaginated).toHaveBeenCalledWith(
        expect.objectContaining({ $or: expect.any(Array) }),
        1,
        100,
        '-createdAt',
      );
      expect(mockPayrollRepository.findAllPayslipsPaginated).toHaveBeenCalledWith(
        expect.any(Types.ObjectId),
        expect.objectContaining({ employeeIds: [employeeId] }),
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
      );
    });

    it('should return empty result immediately when search matches no employees', async () => {
      mockEmployeesRepository.findPaginated.mockResolvedValue({ employees: [], total: 0 });

      const result = await service.getAllPayslips(tenantId, { search: 'nobody' });

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
      expect(mockPayrollRepository.findAllPayslipsPaginated).not.toHaveBeenCalled();
    });

    it('should cap limit at 100', async () => {
      mockPayrollRepository.findAllPayslipsPaginated.mockResolvedValue({ data: [], total: 0 });

      await service.getAllPayslips(tenantId, { limit: 999 });

      expect(mockPayrollRepository.findAllPayslipsPaginated).toHaveBeenCalledWith(
        expect.any(Types.ObjectId),
        expect.any(Object),
        expect.any(Number),
        100,
        expect.any(String),
      );
    });

    it('should calculate totalPages correctly for partial last page', async () => {
      mockPayrollRepository.findAllPayslipsPaginated.mockResolvedValue({ data: [], total: 25 });

      const result = await service.getAllPayslips(tenantId, { page: 1, limit: 20 });

      expect(result.meta.totalPages).toBe(2);
    });
  });

  describe('getEmployeePayslips', () => {
    const tenantId = makeId().toString();
    const employeeId = makeId().toString();

    it('should return payslips scoped to correct tenantId and employeeId', async () => {
      const payslips = [makePayslip()];
      mockPayrollRepository.findPayslipsByEmployee.mockResolvedValue({ data: payslips, total: 1 });

      const result = await service.getEmployeePayslips(tenantId, employeeId, { page: 1, limit: 10 });

      expect(mockPayrollRepository.findPayslipsByEmployee).toHaveBeenCalledWith(
        new Types.ObjectId(tenantId),
        new Types.ObjectId(employeeId),
        1,
        10,
      );
      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({ page: 1, limit: 10, total: 1, totalPages: 1 });
    });

    it('should use default pagination when query is empty', async () => {
      mockPayrollRepository.findPayslipsByEmployee.mockResolvedValue({ data: [], total: 0 });

      await service.getEmployeePayslips(tenantId, employeeId, {});

      expect(mockPayrollRepository.findPayslipsByEmployee).toHaveBeenCalledWith(
        expect.any(Types.ObjectId),
        expect.any(Types.ObjectId),
        1,
        20,
      );
    });

    it('should scope to the given tenantId, not another tenant', async () => {
      const otherTenantId = makeId().toString();
      mockPayrollRepository.findPayslipsByEmployee.mockResolvedValue({ data: [], total: 0 });

      await service.getEmployeePayslips(otherTenantId, employeeId, {});

      const callArgs = mockPayrollRepository.findPayslipsByEmployee.mock.calls[0];
      expect(callArgs[0].toString()).toBe(otherTenantId);
      expect(callArgs[0].toString()).not.toBe(tenantId);
    });
  });

  describe('getEmployeeFinanceSummary', () => {
    const tenantId = makeId().toString();
    const employeeId = makeId().toString();

    const mockSummary = {
      totalPayslips: 12,
      totalNetSalary: 360000,
      totalGrossSalary: 420000,
      averageNetSalary: 30000,
      monthlyBreakdown: [
        { year: 2025, month: 1, netSalary: 30000, grossSalary: 35000 },
        { year: 2025, month: 2, netSalary: 30000, grossSalary: 35000 },
      ],
    };

    it('should return aggregate summary from repository', async () => {
      mockPayrollRepository.getFinanceSummaryByEmployee.mockResolvedValue(mockSummary);

      const result = await service.getEmployeeFinanceSummary(tenantId, employeeId);

      expect(mockPayrollRepository.getFinanceSummaryByEmployee).toHaveBeenCalledWith(
        new Types.ObjectId(tenantId),
        new Types.ObjectId(employeeId),
      );
      expect(result).toEqual(mockSummary);
    });

    it('should return zero values when employee has no payslips', async () => {
      const emptySummary = {
        totalPayslips: 0,
        totalNetSalary: 0,
        totalGrossSalary: 0,
        averageNetSalary: 0,
        monthlyBreakdown: [],
      };
      mockPayrollRepository.getFinanceSummaryByEmployee.mockResolvedValue(emptySummary);

      const result = await service.getEmployeeFinanceSummary(tenantId, employeeId);

      expect(result.totalPayslips).toBe(0);
      expect(result.monthlyBreakdown).toHaveLength(0);
    });

    it('should pass correct ObjectIds to repository', async () => {
      mockPayrollRepository.getFinanceSummaryByEmployee.mockResolvedValue(mockSummary);

      await service.getEmployeeFinanceSummary(tenantId, employeeId);

      const [calledTenantId, calledEmployeeId] = mockPayrollRepository.getFinanceSummaryByEmployee.mock.calls[0];
      expect(calledTenantId.toString()).toBe(tenantId);
      expect(calledEmployeeId.toString()).toBe(employeeId);
    });
  });
});
