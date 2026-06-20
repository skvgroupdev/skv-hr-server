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
import { CompanyPoliciesService } from '../company-policies/company-policies.service';
import { UpdatePayrollPolicyDto as FullUpdatePayrollPolicyDto } from '../company-policies/dto/update-payroll-policy.dto';
import { UpdatePayrollPolicyDto } from './dto/update-payroll-policy.dto';
import { ShiftsRepository } from '../shifts/shifts.repository';
import { UpdatePayslipAdjustmentsDto } from './dto/update-payslip-adjustments.dto';
import { AttendanceRepository } from '../attendance/attendance.repository';

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
    private readonly companyPoliciesService: CompanyPoliciesService,
    private readonly shiftsRepository: ShiftsRepository,
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async createPeriod(
    tenantId: string,
    userId: string,
    dto: CreatePayrollPeriodDto,
  ) {
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
    return {
      data: items,
      meta: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async getPeriod(tenantId: string, id: string) {
    const period = await this.payrollRepository.findPeriodById(
      id,
      new Types.ObjectId(tenantId),
    );
    if (!period) throw new NotFoundException('Payroll period not found');
    return period;
  }

  async generatePayroll(tenantId: string, periodId: string, actorId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const period = await this.payrollRepository.findPeriodById(
      periodId,
      tenantObjectId,
    );
    if (!period) throw new NotFoundException('Payroll period not found');
    if (period.status !== 'DRAFT')
      throw new BadRequestException('Can only generate DRAFT period');

    const { taxConfig, companyConfig } = await this.resolveTaxConfig(tenantId);
    const payrollPolicy = await this.companyPoliciesService.getEffectivePolicy(
      tenantId,
      period.endDate,
    );

    const { employees } = await this.employeesRepository.findPaginated(
      { tenantId: tenantObjectId, status: 'ACTIVE' } as unknown as Parameters<
        EmployeesRepository['findPaginated']
      >[0],
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
        dayType === 'holiday'
          ? otPolicy.holidayRate
          : dayType === 'weekend'
            ? otPolicy.weekendRate
            : otPolicy.weekdayRate;
      // Store rate-weighted hours so tax service multiplies by 1.0 rate
      otAmountByEmployee.set(
        empId,
        (otAmountByEmployee.get(empId) ?? 0) + ot.totalHours * rate,
      );
    }

    // Raw hours still needed for display
    const otHoursByEmployee = new Map<string, number>();
    for (const ot of otRequests) {
      const empId = ot.employeeId.toString();
      otHoursByEmployee.set(
        empId,
        (otHoursByEmployee.get(empId) ?? 0) + ot.totalHours,
      );
    }

    const leaveRequests = await this.leaveRepository.findApprovedInDateRange(
      tenantObjectId,
      period.startDate,
      period.endDate,
    );

    const paidLeaveByEmployee = new Map<string, number>();
    const restDaysByEmployee = new Map<string, number>();
    for (const leave of leaveRequests) {
      const empId = leave.employeeId.toString();
      const target =
        leave.category === 'REST_DAY'
          ? restDaysByEmployee
          : paidLeaveByEmployee;
      if (leave.category !== 'REST_DAY' && !leave.isPaid) continue;
      target.set(empId, (target.get(empId) ?? 0) + leave.totalDays);
    }

    const employeeIds = employees.map(
      (employee) => employee._id as Types.ObjectId,
    );
    const shiftAssignments =
      payrollPolicy.dailyRateMethod === 'SCHEDULED_WORKDAYS'
        ? await this.shiftsRepository.findAssignmentsForRange(
            tenantObjectId,
            employeeIds,
            period.startDate,
            period.endDate,
          )
        : [];
    const presenceDaysByEmployee =
      await this.attendanceRepository.countPresenceDaysByEmployee(
        tenantObjectId,
        employeeIds,
        period.startDate,
        period.endDate,
      );

    const taxMode = companyConfig?.taxMode ?? TaxMode.FULL_DEDUCTION;
    const enableEmployeeSs = companyConfig?.enableEmployeeSs ?? true;
    const enableIncomeTax = companyConfig?.enableIncomeTax ?? true;

    const {
      effectiveEmployeeSsRate,
      effectiveEmployerSsRate,
      applyIncomeTax,
      taxOnCompany,
      noDeduction,
    } = this.taxConfigsService.resolveEffectiveRates(
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

      const approvedRestDays = payrollPolicy.restDayPolicyEnabled
        ? (restDaysByEmployee.get(empId) ?? 0)
        : 0;
      const unusedRestDays = payrollPolicy.restDayPolicyEnabled
        ? Math.max(0, payrollPolicy.monthlyRestDays - approvedRestDays)
        : 0;
      const scheduledDays = this.countScheduledDays(
        payrollPolicy,
        employee._id as Types.ObjectId,
        period.startDate,
        period.endDate,
        shiftAssignments,
      );
      const dailyDivisor =
        payrollPolicy.dailyRateMethod === 'CALENDAR_30'
          ? 30
          : Math.max(1, scheduledDays);
      const restDayCompensationAmount =
        payrollPolicy.restDayPolicyEnabled &&
        payrollPolicy.unusedRestDayCompensationEnabled
          ? ((employee.baseSalary ?? 0) / dailyDivisor) * unusedRestDays
          : 0;

      const attendedDays = presenceDaysByEmployee.get(empId) ?? 0;
      const paidLeaveDays = paidLeaveByEmployee.get(empId) ?? 0;
      const payableDays = Math.min(
        scheduledDays,
        attendedDays + paidLeaveDays + approvedRestDays,
      );
      const absenceDays = Math.max(0, scheduledDays - payableDays);
      const baseSalaryForPeriod =
        payrollPolicy.salaryCalculationMode === 'ATTENDANCE_BASED'
          ? ((employee.baseSalary ?? 0) / dailyDivisor) * payableDays
          : (employee.baseSalary ?? 0);
      const leaveDeductionDays =
        payrollPolicy.salaryCalculationMode === 'MONTHLY_FIXED' &&
        payrollPolicy.absenceDeductionEnabled
          ? absenceDays
          : 0;
      const leaveDeductionAmount =
        (baseSalaryForPeriod / dailyDivisor) * leaveDeductionDays;

      const calculationAllowances = [
        ...(employee.allowances ?? []),
        ...(restDayCompensationAmount > 0
          ? [
              {
                name: 'ຄ່າຊົດເຊີຍວັນພັກທີ່ບໍ່ໄດ້ໃຊ້',
                amount: restDayCompensationAmount,
              },
            ]
          : []),
      ];
      const raw = this.taxCalculationService.calculatePayroll({
        baseSalary: baseSalaryForPeriod,
        allowances: calculationAllowances,
        otHours: otWeightedHours,
        otType: 'weekday',
        otPolicy: { weekdayRate: 1.0, weekendRate: 1.0, holidayRate: 1.0 },
        workingHoursPerMonth: employee.workingHoursPerMonth ?? 208,
        employeeSsRate: effectiveEmployeeSsRate,
        employerSsRate: effectiveEmployerSsRate,
        brackets: applyIncomeTax ? taxConfig.brackets : [],
        deductions: [],
      });

      const adjusted = this.applyTaxModeAdjustments(
        raw,
        taxMode,
        taxOnCompany,
        noDeduction,
      );

      const otherDeductions =
        leaveDeductionAmount > 0
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
        taxConfigSnapshot: (taxConfig.toJSON
          ? taxConfig.toJSON()
          : taxConfig) as unknown as Record<string, unknown>,
        taxMode,
        leaveDeductionDays,
        leaveDeductionAmount,
        approvedRestDays,
        unusedRestDays,
        restDayCompensationAmount,
        payrollPolicySnapshot: policySnapshot(payrollPolicy),
        adjustments: [],
      };
    });

    await this.payrollRepository.createPayslips(payslips);
    return this.payrollRepository.updatePeriod(periodId, tenantObjectId, {
      status: 'GENERATED',
      generatedBy: new Types.ObjectId(actorId),
    });
  }

  private async resolveTaxConfig(tenantId: string) {
    const companyConfig =
      await this.companyTaxConfigsRepository.findByTenant(tenantId);

    // Use taxConfigId from companyConfig if present, else fall back to global current
    const taxConfig = companyConfig?.taxConfigId
      ? await this.taxConfigsRepository.findById(
          companyConfig.taxConfigId.toString(),
        )
      : await this.taxConfigsRepository.findCurrent();

    if (!taxConfig)
      throw new BadRequestException('No active tax configuration');
    return { taxConfig, companyConfig };
  }

  private applyTaxModeAdjustments(
    result: import('../tax-configs/tax-calculation.service').PayrollResult,
    taxMode: TaxMode,
    taxOnCompany: boolean,
    noDeduction: boolean,
  ): import('../tax-configs/tax-calculation.service').PayrollResult {
    if (noDeduction) {
      return {
        ...result,
        employeeSsAmount: 0,
        incomeTax: 0,
        totalDeductions: 0,
        netSalary: result.grossSalary,
      };
    }
    if (taxOnCompany) {
      // Tax is recorded but NOT deducted from employee net salary
      const deductionsWithoutTax = result.totalDeductions - result.incomeTax;
      return {
        ...result,
        totalDeductions: deductionsWithoutTax,
        netSalary: result.grossSalary - deductionsWithoutTax,
      };
    }
    // SS_ONLY: brackets were already passed as [] in calculatePayroll, so incomeTax = 0 naturally
    return result;
  }

  /**
   * @deprecated Alias for hrReviewPeriod() — kept for backward compat.
   * Use POST /periods/:id/hr-review instead.
   */
  async approvePeriod(tenantId: string, periodId: string, actorId: string) {
    return this.hrReviewPeriod(tenantId, periodId, actorId);
  }

  async hrReviewPeriod(tenantId: string, periodId: string, actorId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const period = await this.payrollRepository.findPeriodById(
      periodId,
      tenantObjectId,
    );
    if (!period) throw new NotFoundException('Payroll period not found');
    if (period.status !== 'GENERATED') {
      throw new BadRequestException('Can only review a GENERATED period');
    }
    await this.payrollRepository.updatePayslipStatuses(
      tenantObjectId,
      new Types.ObjectId(periodId),
      'HR_REVIEWED',
    );
    return this.payrollRepository.updatePeriod(periodId, tenantObjectId, {
      status: 'HR_REVIEWED',
      hrReviewedBy: new Types.ObjectId(actorId),
      hrReviewedAt: new Date(),
    });
  }

  async payPeriod(tenantId: string, periodId: string, actorId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const period = await this.payrollRepository.findPeriodById(
      periodId,
      tenantObjectId,
    );
    if (!period) throw new NotFoundException('Payroll period not found');
    if (period.status !== 'HR_REVIEWED') {
      throw new BadRequestException('Can only pay an HR_REVIEWED period');
    }
    await this.payrollRepository.updatePayslipStatuses(
      tenantObjectId,
      new Types.ObjectId(periodId),
      'PAID',
    );
    return this.payrollRepository.updatePeriod(periodId, tenantObjectId, {
      status: 'PAID',
      paidBy: new Types.ObjectId(actorId),
      paidAt: new Date(),
    });
  }

  async updatePayslipAdjustments(
    tenantId: string,
    payslipId: string,
    actorId: string,
    dto: UpdatePayslipAdjustmentsDto,
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const payslip = await this.payrollRepository.findPayslipById(
      payslipId,
      tenantObjectId,
    );
    if (!payslip) throw new NotFoundException('Payslip not found');
    const period = await this.payrollRepository.findPeriodById(
      payslip.payrollPeriodId.toString(),
      tenantObjectId,
    );
    if (!period || period.status !== 'GENERATED') {
      throw new BadRequestException(
        'Adjustments can only be edited during GENERATED review',
      );
    }

    const previousAdditions = (payslip.adjustments ?? [])
      .filter((item) => item.kind === 'ADDITION')
      .reduce((sum, item) => sum + item.amount, 0);
    const previousDeductions = (payslip.adjustments ?? [])
      .filter((item) => item.kind === 'DEDUCTION')
      .reduce((sum, item) => sum + item.amount, 0);
    const additions = dto.adjustments
      .filter((item) => item.kind === 'ADDITION')
      .reduce((sum, item) => sum + item.amount, 0);
    const deductions = dto.adjustments
      .filter((item) => item.kind === 'DEDUCTION')
      .reduce((sum, item) => sum + item.amount, 0);
    const systemGross = payslip.grossSalary - previousAdditions;
    const systemDeductions = payslip.totalDeductions - previousDeductions;
    const grossSalary = systemGross + additions;
    const totalDeductions = systemDeductions + deductions;

    return this.payrollRepository.updatePayslip(payslipId, tenantObjectId, {
      adjustments: dto.adjustments.map((item) => ({
        ...item,
        source: 'MANUAL' as const,
        createdBy: new Types.ObjectId(actorId),
        createdAt: new Date(),
      })),
      grossSalary,
      totalDeductions,
      netSalary: grossSalary - totalDeductions,
    });
  }

  private countScheduledDays(
    policy: Awaited<ReturnType<CompanyPoliciesService['getEffectivePolicy']>>,
    employeeId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    assignments: Array<{
      employeeId: Types.ObjectId;
      effectiveDate: Date;
      endDate?: Date;
      shiftId: unknown;
    }>,
  ) {
    let count = 0;
    for (
      const cursor = startOfUtcDay(startDate);
      cursor <= endDate;
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    ) {
      let workDays = policy.uniformSchedule.workDays;
      if (policy.workScheduleMode === 'SHIFT_BASED') {
        const assignment = assignments.find(
          (item) =>
            item.employeeId.toString() === employeeId.toString() &&
            item.effectiveDate <= cursor &&
            (!item.endDate || item.endDate >= cursor),
        );
        const shift = assignment?.shiftId as
          | { workDays?: number[] }
          | undefined;
        workDays = shift?.workDays ?? [];
      }
      if (workDays.includes(cursor.getUTCDay())) count += 1;
    }
    return count;
  }

  /**
   * @deprecated Alias for payPeriod() — kept for backward compat.
   * Use POST /periods/:id/pay instead.
   */
  async lockPeriod(tenantId: string, periodId: string, actorId: string) {
    return this.payPeriod(tenantId, periodId, actorId);
  }

  async getPeriodPayslips(
    tenantId: string,
    periodId: string,
    page = 1,
    limit = 20,
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const safeLimit = Math.min(MAX_LIMIT, limit);
    const { items, total } = await this.payrollRepository.findPayslipsByPeriod(
      tenantObjectId,
      new Types.ObjectId(periodId),
      page,
      safeLimit,
    );
    return {
      data: items,
      meta: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async getPayslipById(tenantId: string, payslipId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const payslip = await this.payrollRepository.findPayslipByIdWithPopulate(
      payslipId,
      tenantObjectId,
    );
    if (!payslip) throw new NotFoundException('Payslip not found');
    return payslip;
  }

  async getMyPayslips(tenantId: string, userId: string, page = 1, limit = 20) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const safeLimit = Math.min(MAX_LIMIT, limit);

    const { employees } = await this.employeesRepository.findPaginated(
      {
        tenantId: tenantObjectId,
        userId: new Types.ObjectId(userId),
      } as unknown as Parameters<EmployeesRepository['findPaginated']>[0],
      1,
      1,
      '-createdAt',
    );
    if (!employees[0])
      throw new NotFoundException('Employee profile not found');

    const { items, total } = await this.payrollRepository.findMyPayslips(
      tenantObjectId,
      employees[0]._id as Types.ObjectId,
      page,
      safeLimit,
    );
    return {
      data: items,
      meta: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async getMyPayslip(tenantId: string, userId: string, payslipId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);

    const { employees } = await this.employeesRepository.findPaginated(
      {
        tenantId: tenantObjectId,
        userId: new Types.ObjectId(userId),
      } as unknown as Parameters<EmployeesRepository['findPaginated']>[0],
      1,
      1,
      '-createdAt',
    );
    if (!employees[0])
      throw new NotFoundException('Employee profile not found');

    const payslip = await this.payrollRepository.findPayslipById(
      payslipId,
      tenantObjectId,
    );
    if (!payslip) throw new NotFoundException('Payslip not found');

    if (
      payslip.employeeId.toString() !==
      (employees[0]._id as Types.ObjectId).toString()
    ) {
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
          $or: [
            { firstName: nameRegex },
            { lastName: nameRegex },
            { employeeCode: nameRegex },
          ],
        } as unknown as Parameters<EmployeesRepository['findPaginated']>[0],
        1,
        100,
        '-createdAt',
      );
      employeeIds = employees.map((e) => e._id as Types.ObjectId);
      if (employeeIds.length === 0) {
        return {
          data: [],
          meta: { page, limit: safeLimit, total: 0, totalPages: 0 },
        };
      }
    }

    const { data, total } =
      await this.payrollRepository.findAllPayslipsPaginated(
        tenantObjectId,
        {
          periodId: query.periodId,
          status: query.status,
          employeeIds,
          startDate: query.startDate,
          endDate: query.endDate,
        },
        page,
        safeLimit,
        sort,
      );

    return {
      data,
      meta: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async getEmployeePayslips(
    tenantId: string,
    employeeId: string,
    query: { page?: number; limit?: number },
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const page = query.page ?? 1;
    const safeLimit = Math.min(MAX_LIMIT, query.limit ?? 20);

    const { data, total } = await this.payrollRepository.findPayslipsByEmployee(
      tenantObjectId,
      new Types.ObjectId(employeeId),
      page,
      safeLimit,
    );

    return {
      data,
      meta: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async getEmployeeFinanceSummary(tenantId: string, employeeId: string) {
    const summary = await this.payrollRepository.getFinanceSummaryByEmployee(
      new Types.ObjectId(tenantId),
      new Types.ObjectId(employeeId),
    );
    return summary;
  }

  async getPayrollPolicy(tenantId: string) {
    return this.companyPoliciesService.getEffectivePolicy(tenantId);
  }

  async updatePayrollPolicy(
    tenantId: string,
    actorId: string,
    actorRole: string,
    dto: UpdatePayrollPolicyDto,
  ) {
    // Merge only the 3 TOR-defined fields on top of the current policy
    const current = await this.companyPoliciesService.getEffectivePolicy(tenantId);
    const merged: FullUpdatePayrollPolicyDto = {
      salaryCalculationMode: current.salaryCalculationMode,
      dailyRateMethod: current.dailyRateMethod,
      restDayPolicyEnabled: dto.restDayPolicyEnabled ?? current.restDayPolicyEnabled,
      monthlyRestDays: dto.monthlyRestDays ?? current.monthlyRestDays,
      unusedRestDayCompensationEnabled:
        dto.unusedRestDayCompensationEnabled ?? current.unusedRestDayCompensationEnabled,
      unusedRestDaysCarryForward: current.unusedRestDaysCarryForward ?? false,
      lateToleranceMinutes: current.lateToleranceMinutes ?? 15,
      earlyLeaveToleranceMinutes: current.earlyLeaveToleranceMinutes ?? 0,
      absenceDeductionEnabled: current.absenceDeductionEnabled ?? false,
    };
    return this.companyPoliciesService.updatePayrollPolicy(tenantId, actorId, actorRole, merged);
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

function startOfUtcDay(date: Date) {
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

function policySnapshot(policy: unknown): Record<string, unknown> {
  if (policy && typeof policy === 'object' && 'toObject' in policy) {
    return (policy as { toObject: () => Record<string, unknown> }).toObject();
  }
  return { ...(policy as Record<string, unknown>) };
}
