import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { PayrollRepository } from './payroll.repository';
import { TaxCalculationService } from '../tax-configs/tax-calculation.service';
import { TaxConfigsRepository } from '../tax-configs/tax-configs.repository';
import { TaxConfigsService } from '../tax-configs/tax-configs.service';
import { CompanyTaxConfigsRepository } from '../tax-configs/company-tax-configs.repository';
import { TaxMode } from '../tax-configs/schemas/company-tax-config.schema';
import { EmployeesRepository } from '../employees/employees.repository';
import { OTRepository } from '../ot/ot.repository';
import { LeaveRepository } from '../leave/leave.repository';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';

const MAX_LIMIT = 100;

@Injectable()
export class PayrollService {
  constructor(
    private readonly payrollRepository: PayrollRepository,
    private readonly taxCalculationService: TaxCalculationService,
    private readonly taxConfigsRepository: TaxConfigsRepository,
    private readonly taxConfigsService: TaxConfigsService,
    private readonly companyTaxConfigsRepository: CompanyTaxConfigsRepository,
    private readonly employeesRepository: EmployeesRepository,
    private readonly otRepository: OTRepository,
    private readonly leaveRepository: LeaveRepository,
  ) {}

  async createPeriod(tenantId: string, userId: string, dto: CreatePayrollPeriodDto) {
    return this.payrollRepository.createPeriod({
      tenantId: new Types.ObjectId(tenantId),
      name: dto.name,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

  async listPeriods(tenantId: string, page = 1, limit = 20) {
    const safeLimit = Math.min(MAX_LIMIT, limit);
    const { items, total } = await this.payrollRepository.findPeriodsPaginated(
      new Types.ObjectId(tenantId),
      page,
      safeLimit,
    );
    return { data: items, meta: { page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
  }

  async getPeriod(tenantId: string, id: string) {
    const period = await this.payrollRepository.findPeriodById(id, new Types.ObjectId(tenantId));
    if (!period) throw new NotFoundException('Payroll period not found');
    return period;
  }

  async generatePayroll(tenantId: string, periodId: string, actorId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const period = await this.payrollRepository.findPeriodById(periodId, tenantObjectId);
    if (!period) throw new NotFoundException('Payroll period not found');
    if (period.status !== 'DRAFT') throw new BadRequestException('Can only generate DRAFT period');

    const { taxConfig, companyConfig } = await this.resolveTaxConfig(tenantId);

    const { employees } = await this.employeesRepository.findPaginated(
      { tenantId: tenantObjectId, status: 'ACTIVE' } as unknown as Parameters<EmployeesRepository['findPaginated']>[0],
      1,
      1000,
      '-createdAt',
    );

    const otRequests = await this.otRepository.findApprovedInDateRange(
      tenantObjectId,
      period.startDate,
      period.endDate,
    );

    // Fetch OT policy; fall back to defaults if not configured
    const otPolicyDoc = await this.otRepository.getPolicy(tenantObjectId);
    const otPolicy = {
      weekdayRate: otPolicyDoc?.weekdayRate ?? 1.5,
      weekendRate: otPolicyDoc?.weekendRate ?? 2.0,
      holidayRate: otPolicyDoc?.holidayRate ?? 3.0,
    };

    // Map employeeId -> weighted OT hours (already rate-adjusted hours equivalent)
    // We store per-dayType hours separately so calculatePayroll can use a single rate of 1.0
    const otAmountByEmployee = new Map<string, number>();
    for (const ot of otRequests) {
      const empId = ot.employeeId.toString();
      const dayType = (ot as { dayType?: string }).dayType ?? 'weekday';
      const rate =
        dayType === 'holiday' ? otPolicy.holidayRate
        : dayType === 'weekend' ? otPolicy.weekendRate
        : otPolicy.weekdayRate;
      // Store rate-weighted hours so tax service multiplies by 1.0 rate
      otAmountByEmployee.set(empId, (otAmountByEmployee.get(empId) ?? 0) + ot.totalHours * rate);
    }

    // Raw hours still needed for display
    const otHoursByEmployee = new Map<string, number>();
    for (const ot of otRequests) {
      const empId = ot.employeeId.toString();
      otHoursByEmployee.set(empId, (otHoursByEmployee.get(empId) ?? 0) + ot.totalHours);
    }

    const leaveRequests = await this.leaveRepository.findApprovedInDateRange(
      tenantObjectId,
      period.startDate,
      period.endDate,
    );

    const leaveByEmployee = new Map<string, number>();
    for (const leave of leaveRequests) {
      const empId = leave.employeeId.toString();
      leaveByEmployee.set(empId, (leaveByEmployee.get(empId) ?? 0) + leave.totalDays);
    }

    const taxMode = companyConfig?.taxMode ?? TaxMode.FULL_DEDUCTION;
    const enableEmployeeSs = companyConfig?.enableEmployeeSs ?? true;
    const enableIncomeTax = companyConfig?.enableIncomeTax ?? true;

    const { effectiveEmployeeSsRate, effectiveEmployerSsRate, applyIncomeTax, taxOnCompany, noDeduction } =
      this.taxConfigsService.resolveEffectiveRates(
        taxMode,
        enableEmployeeSs,
        enableIncomeTax,
        taxConfig.employeeSsRate,
        taxConfig.employerSsRate,
      );

    const payslips = employees.map((employee) => {
      const empId = (employee._id as Types.ObjectId).toString();
      const otHours = otHoursByEmployee.get(empId) ?? 0;
      // Rate-weighted hours: e.g. 2h holiday = 2 * 3.0 = 6 weighted hours at rate 1.0
      const otWeightedHours = otAmountByEmployee.get(empId) ?? 0;

      const { leaveDeductionDays, leaveDeductionAmount } = this.calcLeaveDeduction(
        employee.baseSalary ?? 0,
        employee.employmentType,
        leaveByEmployee.get(empId) ?? 0,
      );

      const raw = this.taxCalculationService.calculatePayroll({
        baseSalary: employee.baseSalary ?? 0,
        allowances: employee.allowances ?? [],
        otHours: otWeightedHours,
        otType: 'weekday',
        otPolicy: { weekdayRate: 1.0, weekendRate: 1.0, holidayRate: 1.0 },
        workingHoursPerMonth: employee.workingHoursPerMonth ?? 208,
        employeeSsRate: effectiveEmployeeSsRate,
        employerSsRate: effectiveEmployerSsRate,
        brackets: applyIncomeTax ? taxConfig.brackets : [],
        deductions: [],
      });

      const adjusted = this.applyTaxModeAdjustments(raw, taxMode, taxOnCompany, noDeduction);

      const otherDeductions = leaveDeductionAmount > 0
        ? [{ name: 'ຫັກລາພັກ', amount: leaveDeductionAmount }]
        : [];

      const totalDeductions = adjusted.totalDeductions + leaveDeductionAmount;
      const netSalary = adjusted.netSalary - leaveDeductionAmount;

      return {
        tenantId: tenantObjectId,
        payrollPeriodId: new Types.ObjectId(periodId),
        employeeId: employee._id as Types.ObjectId,
        baseSalary: adjusted.baseSalary,
        allowances: employee.allowances ?? [],
        otHours, // raw hours for display
        otAmount: adjusted.otAmount,
        grossSalary: adjusted.grossSalary,
        employeeSsAmount: adjusted.employeeSsAmount,
        taxableIncome: adjusted.taxableIncome,
        incomeTax: adjusted.incomeTax,
        otherDeductions,
        totalDeductions,
        netSalary,
        employerSsAmount: adjusted.employerSsAmount,
        taxConfigSnapshot: (taxConfig.toJSON ? taxConfig.toJSON() : taxConfig) as unknown as Record<string, unknown>,
        taxMode,
        leaveDeductionDays,
        leaveDeductionAmount,
      };
    });

    await this.payrollRepository.createPayslips(payslips);
    return this.payrollRepository.updatePeriod(periodId, tenantObjectId, {
      status: 'GENERATED',
      generatedBy: new Types.ObjectId(actorId),
    });
  }

  private calcLeaveDeduction(
    baseSalary: number,
    employmentType: string | undefined,
    absenceDays: number,
  ): { leaveDeductionDays: number; leaveDeductionAmount: number } {
    if (employmentType === 'FULL_TIME' || absenceDays === 0) {
      return { leaveDeductionDays: 0, leaveDeductionAmount: 0 };
    }
    const WORKING_DAYS_PER_MONTH = 22;
    const dailyRate = baseSalary / WORKING_DAYS_PER_MONTH;
    return {
      leaveDeductionDays: absenceDays,
      leaveDeductionAmount: dailyRate * absenceDays,
    };
  }

  private async resolveTaxConfig(tenantId: string) {
    const companyConfig = await this.companyTaxConfigsRepository.findByTenant(tenantId);

    // Use taxConfigId from companyConfig if present, else fall back to global current
    const taxConfig = companyConfig?.taxConfigId
      ? await this.taxConfigsRepository.findById(companyConfig.taxConfigId.toString())
      : await this.taxConfigsRepository.findCurrent();

    if (!taxConfig) throw new BadRequestException('No active tax configuration');
    return { taxConfig, companyConfig };
  }

  private applyTaxModeAdjustments(
    result: import('../tax-configs/tax-calculation.service').PayrollResult,
    taxMode: TaxMode,
    taxOnCompany: boolean,
    noDeduction: boolean,
  ): import('../tax-configs/tax-calculation.service').PayrollResult {
    if (noDeduction) {
      return { ...result, employeeSsAmount: 0, incomeTax: 0, totalDeductions: 0, netSalary: result.grossSalary };
    }
    if (taxOnCompany) {
      // Tax is recorded but NOT deducted from employee net salary
      const deductionsWithoutTax = result.totalDeductions - result.incomeTax;
      return { ...result, totalDeductions: deductionsWithoutTax, netSalary: result.grossSalary - deductionsWithoutTax };
    }
    // SS_ONLY: brackets were already passed as [] in calculatePayroll, so incomeTax = 0 naturally
    return result;
  }

  async approvePeriod(tenantId: string, periodId: string, actorId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const period = await this.payrollRepository.findPeriodById(periodId, tenantObjectId);
    if (!period) throw new NotFoundException('Payroll period not found');
    if (period.status !== 'GENERATED') throw new BadRequestException('Can only approve GENERATED period');

    return this.payrollRepository.updatePeriod(periodId, tenantObjectId, {
      status: 'APPROVED',
      approvedBy: new Types.ObjectId(actorId),
    });
  }

  async lockPeriod(tenantId: string, periodId: string, actorId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const period = await this.payrollRepository.findPeriodById(periodId, tenantObjectId);
    if (!period) throw new NotFoundException('Payroll period not found');
    if (period.status !== 'APPROVED') throw new BadRequestException('Can only lock APPROVED period');

    return this.payrollRepository.updatePeriod(periodId, tenantObjectId, {
      status: 'LOCKED',
      lockedBy: new Types.ObjectId(actorId),
    });
  }

  async getPeriodPayslips(tenantId: string, periodId: string, page = 1, limit = 20) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const safeLimit = Math.min(MAX_LIMIT, limit);
    const { items, total } = await this.payrollRepository.findPayslipsByPeriod(
      tenantObjectId,
      new Types.ObjectId(periodId),
      page,
      safeLimit,
    );
    return { data: items, meta: { page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
  }

  async getPayslipById(tenantId: string, payslipId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const payslip = await this.payrollRepository.findPayslipByIdWithPopulate(payslipId, tenantObjectId);
    if (!payslip) throw new NotFoundException('Payslip not found');
    return payslip;
  }

  async getMyPayslips(tenantId: string, userId: string, page = 1, limit = 20) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const safeLimit = Math.min(MAX_LIMIT, limit);

    const { employees } = await this.employeesRepository.findPaginated(
      { tenantId: tenantObjectId, userId: new Types.ObjectId(userId) } as unknown as Parameters<EmployeesRepository['findPaginated']>[0],
      1,
      1,
      '-createdAt',
    );
    if (!employees[0]) throw new NotFoundException('Employee profile not found');

    const { items, total } = await this.payrollRepository.findMyPayslips(
      tenantObjectId,
      employees[0]._id as Types.ObjectId,
      page,
      safeLimit,
    );
    return { data: items, meta: { page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
  }

  async getMyPayslip(tenantId: string, userId: string, payslipId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);

    const { employees } = await this.employeesRepository.findPaginated(
      { tenantId: tenantObjectId, userId: new Types.ObjectId(userId) } as unknown as Parameters<EmployeesRepository['findPaginated']>[0],
      1,
      1,
      '-createdAt',
    );
    if (!employees[0]) throw new NotFoundException('Employee profile not found');

    const payslip = await this.payrollRepository.findPayslipById(payslipId, tenantObjectId);
    if (!payslip) throw new NotFoundException('Payslip not found');

    if (payslip.employeeId.toString() !== (employees[0]._id as Types.ObjectId).toString()) {
      throw new ForbiddenException('Access denied');
    }

    return payslip;
  }

  async getAllPayslips(
    tenantId: string,
    query: {
      page?: number;
      limit?: number;
      sort?: string;
      periodId?: string;
      status?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const page = query.page ?? 1;
    const safeLimit = Math.min(MAX_LIMIT, query.limit ?? 20);
    const sort = query.sort ?? '-createdAt';

    let employeeIds: Types.ObjectId[] | undefined;
    if (query.search) {
      const nameRegex = new RegExp(query.search, 'i');
      const { employees } = await this.employeesRepository.findPaginated(
        {
          tenantId: tenantObjectId,
          $or: [{ firstName: nameRegex }, { lastName: nameRegex }, { employeeCode: nameRegex }],
        } as unknown as Parameters<EmployeesRepository['findPaginated']>[0],
        1,
        100,
        '-createdAt',
      );
      employeeIds = employees.map((e) => e._id as Types.ObjectId);
      if (employeeIds.length === 0) {
        return { data: [], meta: { page, limit: safeLimit, total: 0, totalPages: 0 } };
      }
    }

    const { data, total } = await this.payrollRepository.findAllPayslipsPaginated(
      tenantObjectId,
      { periodId: query.periodId, status: query.status, employeeIds, startDate: query.startDate, endDate: query.endDate },
      page,
      safeLimit,
      sort,
    );

    return { data, meta: { page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
  }

  async getEmployeePayslips(tenantId: string, employeeId: string, query: { page?: number; limit?: number }) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const page = query.page ?? 1;
    const safeLimit = Math.min(MAX_LIMIT, query.limit ?? 20);

    const { data, total } = await this.payrollRepository.findPayslipsByEmployee(
      tenantObjectId,
      new Types.ObjectId(employeeId),
      page,
      safeLimit,
    );

    return { data, meta: { page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
  }

  async getEmployeeFinanceSummary(tenantId: string, employeeId: string) {
    const summary = await this.payrollRepository.getFinanceSummaryByEmployee(
      new Types.ObjectId(tenantId),
      new Types.ObjectId(employeeId),
    );
    return summary;
  }

  async getReport(tenantId: string, periodId?: string) {
    if (!periodId) throw new BadRequestException('periodId is required');

    const tenantObjectId = new Types.ObjectId(tenantId);
    const report = await this.payrollRepository.aggregatePeriodReport(
      tenantObjectId,
      new Types.ObjectId(periodId),
    );
    return { periodId, ...report };
  }
}
