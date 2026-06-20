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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const payroll_repository_1 = require("./payroll.repository");
const tax_calculation_service_1 = require("../tax-configs/tax-calculation.service");
const tax_configs_repository_1 = require("../tax-configs/tax-configs.repository");
const tax_configs_service_1 = require("../tax-configs/tax-configs.service");
const company_tax_configs_repository_1 = require("../tax-configs/company-tax-configs.repository");
const company_tax_config_schema_1 = require("../tax-configs/schemas/company-tax-config.schema");
const employees_repository_1 = require("../employees/employees.repository");
const ot_repository_1 = require("../ot/ot.repository");
const leave_repository_1 = require("../leave/leave.repository");
const company_policies_service_1 = require("../company-policies/company-policies.service");
const shifts_repository_1 = require("../shifts/shifts.repository");
const attendance_repository_1 = require("../attendance/attendance.repository");
const MAX_LIMIT = 100;
let PayrollService = class PayrollService {
    payrollRepository;
    taxCalculationService;
    taxConfigsRepository;
    taxConfigsService;
    companyTaxConfigsRepository;
    employeesRepository;
    otRepository;
    leaveRepository;
    companyPoliciesService;
    shiftsRepository;
    attendanceRepository;
    constructor(payrollRepository, taxCalculationService, taxConfigsRepository, taxConfigsService, companyTaxConfigsRepository, employeesRepository, otRepository, leaveRepository, companyPoliciesService, shiftsRepository, attendanceRepository) {
        this.payrollRepository = payrollRepository;
        this.taxCalculationService = taxCalculationService;
        this.taxConfigsRepository = taxConfigsRepository;
        this.taxConfigsService = taxConfigsService;
        this.companyTaxConfigsRepository = companyTaxConfigsRepository;
        this.employeesRepository = employeesRepository;
        this.otRepository = otRepository;
        this.leaveRepository = leaveRepository;
        this.companyPoliciesService = companyPoliciesService;
        this.shiftsRepository = shiftsRepository;
        this.attendanceRepository = attendanceRepository;
    }
    async createPeriod(tenantId, userId, dto) {
        return this.payrollRepository.createPeriod({
            tenantId: new mongoose_1.Types.ObjectId(tenantId),
            name: dto.name,
            startDate: new Date(dto.startDate),
            endDate: new Date(dto.endDate),
        });
    }
    async listPeriods(tenantId, page = 1, limit = 20) {
        const safeLimit = Math.min(MAX_LIMIT, limit);
        const { items, total } = await this.payrollRepository.findPeriodsPaginated(new mongoose_1.Types.ObjectId(tenantId), page, safeLimit);
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
    async getPeriod(tenantId, id) {
        const period = await this.payrollRepository.findPeriodById(id, new mongoose_1.Types.ObjectId(tenantId));
        if (!period)
            throw new common_1.NotFoundException('Payroll period not found');
        return period;
    }
    async generatePayroll(tenantId, periodId, actorId) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const period = await this.payrollRepository.findPeriodById(periodId, tenantObjectId);
        if (!period)
            throw new common_1.NotFoundException('Payroll period not found');
        if (period.status !== 'DRAFT')
            throw new common_1.BadRequestException('Can only generate DRAFT period');
        const { taxConfig, companyConfig } = await this.resolveTaxConfig(tenantId);
        const payrollPolicy = await this.companyPoliciesService.getEffectivePolicy(tenantId, period.endDate);
        const { employees } = await this.employeesRepository.findPaginated({ tenantId: tenantObjectId, status: 'ACTIVE' }, 1, 1000, '-createdAt');
        const otRequests = await this.otRepository.findApprovedInDateRange(tenantObjectId, period.startDate, period.endDate);
        const otPolicyDoc = await this.otRepository.getPolicy(tenantObjectId);
        const otPolicy = {
            weekdayRate: otPolicyDoc?.weekdayRate ?? 1.5,
            weekendRate: otPolicyDoc?.weekendRate ?? 2.0,
            holidayRate: otPolicyDoc?.holidayRate ?? 3.0,
        };
        const otAmountByEmployee = new Map();
        for (const ot of otRequests) {
            const empId = ot.employeeId.toString();
            const dayType = ot.dayType ?? 'weekday';
            const rate = dayType === 'holiday'
                ? otPolicy.holidayRate
                : dayType === 'weekend'
                    ? otPolicy.weekendRate
                    : otPolicy.weekdayRate;
            otAmountByEmployee.set(empId, (otAmountByEmployee.get(empId) ?? 0) + ot.totalHours * rate);
        }
        const otHoursByEmployee = new Map();
        for (const ot of otRequests) {
            const empId = ot.employeeId.toString();
            otHoursByEmployee.set(empId, (otHoursByEmployee.get(empId) ?? 0) + ot.totalHours);
        }
        const leaveRequests = await this.leaveRepository.findApprovedInDateRange(tenantObjectId, period.startDate, period.endDate);
        const paidLeaveByEmployee = new Map();
        const restDaysByEmployee = new Map();
        for (const leave of leaveRequests) {
            const empId = leave.employeeId.toString();
            const target = leave.category === 'REST_DAY'
                ? restDaysByEmployee
                : paidLeaveByEmployee;
            if (leave.category !== 'REST_DAY' && !leave.isPaid)
                continue;
            target.set(empId, (target.get(empId) ?? 0) + leave.totalDays);
        }
        const employeeIds = employees.map((employee) => employee._id);
        const shiftAssignments = payrollPolicy.dailyRateMethod === 'SCHEDULED_WORKDAYS'
            ? await this.shiftsRepository.findAssignmentsForRange(tenantObjectId, employeeIds, period.startDate, period.endDate)
            : [];
        const presenceDaysByEmployee = await this.attendanceRepository.countPresenceDaysByEmployee(tenantObjectId, employeeIds, period.startDate, period.endDate);
        const taxMode = companyConfig?.taxMode ?? company_tax_config_schema_1.TaxMode.FULL_DEDUCTION;
        const enableEmployeeSs = companyConfig?.enableEmployeeSs ?? true;
        const enableIncomeTax = companyConfig?.enableIncomeTax ?? true;
        const { effectiveEmployeeSsRate, effectiveEmployerSsRate, applyIncomeTax, taxOnCompany, noDeduction, } = this.taxConfigsService.resolveEffectiveRates(taxMode, enableEmployeeSs, enableIncomeTax, taxConfig.employeeSsRate, taxConfig.employerSsRate);
        const payslips = employees.map((employee) => {
            const empId = employee._id.toString();
            const otHours = otHoursByEmployee.get(empId) ?? 0;
            const otWeightedHours = otAmountByEmployee.get(empId) ?? 0;
            const approvedRestDays = payrollPolicy.restDayPolicyEnabled
                ? (restDaysByEmployee.get(empId) ?? 0)
                : 0;
            const unusedRestDays = payrollPolicy.restDayPolicyEnabled
                ? Math.max(0, payrollPolicy.monthlyRestDays - approvedRestDays)
                : 0;
            const scheduledDays = this.countScheduledDays(payrollPolicy, employee._id, period.startDate, period.endDate, shiftAssignments);
            const dailyDivisor = payrollPolicy.dailyRateMethod === 'CALENDAR_30'
                ? 30
                : Math.max(1, scheduledDays);
            const restDayCompensationAmount = payrollPolicy.restDayPolicyEnabled &&
                payrollPolicy.unusedRestDayCompensationEnabled
                ? ((employee.baseSalary ?? 0) / dailyDivisor) * unusedRestDays
                : 0;
            const attendedDays = presenceDaysByEmployee.get(empId) ?? 0;
            const paidLeaveDays = paidLeaveByEmployee.get(empId) ?? 0;
            const payableDays = Math.min(scheduledDays, attendedDays + paidLeaveDays + approvedRestDays);
            const absenceDays = Math.max(0, scheduledDays - payableDays);
            const baseSalaryForPeriod = payrollPolicy.salaryCalculationMode === 'ATTENDANCE_BASED'
                ? ((employee.baseSalary ?? 0) / dailyDivisor) * payableDays
                : (employee.baseSalary ?? 0);
            const leaveDeductionDays = payrollPolicy.salaryCalculationMode === 'MONTHLY_FIXED' &&
                payrollPolicy.absenceDeductionEnabled
                ? absenceDays
                : 0;
            const leaveDeductionAmount = (baseSalaryForPeriod / dailyDivisor) * leaveDeductionDays;
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
            const adjusted = this.applyTaxModeAdjustments(raw, taxMode, taxOnCompany, noDeduction);
            const otherDeductions = leaveDeductionAmount > 0
                ? [{ name: 'ຫັກລາພັກ', amount: leaveDeductionAmount }]
                : [];
            const totalDeductions = adjusted.totalDeductions + leaveDeductionAmount;
            const netSalary = adjusted.netSalary - leaveDeductionAmount;
            return {
                tenantId: tenantObjectId,
                payrollPeriodId: new mongoose_1.Types.ObjectId(periodId),
                employeeId: employee._id,
                baseSalary: adjusted.baseSalary,
                allowances: employee.allowances ?? [],
                otHours,
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
                    : taxConfig),
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
            generatedBy: new mongoose_1.Types.ObjectId(actorId),
        });
    }
    async resolveTaxConfig(tenantId) {
        const companyConfig = await this.companyTaxConfigsRepository.findByTenant(tenantId);
        const taxConfig = companyConfig?.taxConfigId
            ? await this.taxConfigsRepository.findById(companyConfig.taxConfigId.toString())
            : await this.taxConfigsRepository.findCurrent();
        if (!taxConfig)
            throw new common_1.BadRequestException('No active tax configuration');
        return { taxConfig, companyConfig };
    }
    applyTaxModeAdjustments(result, taxMode, taxOnCompany, noDeduction) {
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
            const deductionsWithoutTax = result.totalDeductions - result.incomeTax;
            return {
                ...result,
                totalDeductions: deductionsWithoutTax,
                netSalary: result.grossSalary - deductionsWithoutTax,
            };
        }
        return result;
    }
    async approvePeriod(tenantId, periodId, actorId) {
        return this.hrReviewPeriod(tenantId, periodId, actorId);
    }
    async hrReviewPeriod(tenantId, periodId, actorId) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const period = await this.payrollRepository.findPeriodById(periodId, tenantObjectId);
        if (!period)
            throw new common_1.NotFoundException('Payroll period not found');
        if (period.status !== 'GENERATED') {
            throw new common_1.BadRequestException('Can only review a GENERATED period');
        }
        await this.payrollRepository.updatePayslipStatuses(tenantObjectId, new mongoose_1.Types.ObjectId(periodId), 'HR_REVIEWED');
        return this.payrollRepository.updatePeriod(periodId, tenantObjectId, {
            status: 'HR_REVIEWED',
            hrReviewedBy: new mongoose_1.Types.ObjectId(actorId),
            hrReviewedAt: new Date(),
        });
    }
    async payPeriod(tenantId, periodId, actorId) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const period = await this.payrollRepository.findPeriodById(periodId, tenantObjectId);
        if (!period)
            throw new common_1.NotFoundException('Payroll period not found');
        if (period.status !== 'HR_REVIEWED') {
            throw new common_1.BadRequestException('Can only pay an HR_REVIEWED period');
        }
        await this.payrollRepository.updatePayslipStatuses(tenantObjectId, new mongoose_1.Types.ObjectId(periodId), 'PAID');
        return this.payrollRepository.updatePeriod(periodId, tenantObjectId, {
            status: 'PAID',
            paidBy: new mongoose_1.Types.ObjectId(actorId),
            paidAt: new Date(),
        });
    }
    async updatePayslipAdjustments(tenantId, payslipId, actorId, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const payslip = await this.payrollRepository.findPayslipById(payslipId, tenantObjectId);
        if (!payslip)
            throw new common_1.NotFoundException('Payslip not found');
        const period = await this.payrollRepository.findPeriodById(payslip.payrollPeriodId.toString(), tenantObjectId);
        if (!period || period.status !== 'GENERATED') {
            throw new common_1.BadRequestException('Adjustments can only be edited during GENERATED review');
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
                source: 'MANUAL',
                createdBy: new mongoose_1.Types.ObjectId(actorId),
                createdAt: new Date(),
            })),
            grossSalary,
            totalDeductions,
            netSalary: grossSalary - totalDeductions,
        });
    }
    countScheduledDays(policy, employeeId, startDate, endDate, assignments) {
        let count = 0;
        for (const cursor = startOfUtcDay(startDate); cursor <= endDate; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
            let workDays = policy.uniformSchedule.workDays;
            if (policy.workScheduleMode === 'SHIFT_BASED') {
                const assignment = assignments.find((item) => item.employeeId.toString() === employeeId.toString() &&
                    item.effectiveDate <= cursor &&
                    (!item.endDate || item.endDate >= cursor));
                const shift = assignment?.shiftId;
                workDays = shift?.workDays ?? [];
            }
            if (workDays.includes(cursor.getUTCDay()))
                count += 1;
        }
        return count;
    }
    async lockPeriod(tenantId, periodId, actorId) {
        return this.payPeriod(tenantId, periodId, actorId);
    }
    async getPeriodPayslips(tenantId, periodId, page = 1, limit = 20) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const safeLimit = Math.min(MAX_LIMIT, limit);
        const { items, total } = await this.payrollRepository.findPayslipsByPeriod(tenantObjectId, new mongoose_1.Types.ObjectId(periodId), page, safeLimit);
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
    async getPayslipById(tenantId, payslipId) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const payslip = await this.payrollRepository.findPayslipByIdWithPopulate(payslipId, tenantObjectId);
        if (!payslip)
            throw new common_1.NotFoundException('Payslip not found');
        return payslip;
    }
    async getMyPayslips(tenantId, userId, page = 1, limit = 20) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const safeLimit = Math.min(MAX_LIMIT, limit);
        const { employees } = await this.employeesRepository.findPaginated({
            tenantId: tenantObjectId,
            userId: new mongoose_1.Types.ObjectId(userId),
        }, 1, 1, '-createdAt');
        if (!employees[0])
            throw new common_1.NotFoundException('Employee profile not found');
        const { items, total } = await this.payrollRepository.findMyPayslips(tenantObjectId, employees[0]._id, page, safeLimit);
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
    async getMyPayslip(tenantId, userId, payslipId) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const { employees } = await this.employeesRepository.findPaginated({
            tenantId: tenantObjectId,
            userId: new mongoose_1.Types.ObjectId(userId),
        }, 1, 1, '-createdAt');
        if (!employees[0])
            throw new common_1.NotFoundException('Employee profile not found');
        const payslip = await this.payrollRepository.findPayslipById(payslipId, tenantObjectId);
        if (!payslip)
            throw new common_1.NotFoundException('Payslip not found');
        if (payslip.employeeId.toString() !==
            employees[0]._id.toString()) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return payslip;
    }
    async getAllPayslips(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const page = query.page ?? 1;
        const safeLimit = Math.min(MAX_LIMIT, query.limit ?? 20);
        const sort = query.sort ?? '-createdAt';
        let employeeIds;
        if (query.search) {
            const nameRegex = new RegExp(query.search, 'i');
            const { employees } = await this.employeesRepository.findPaginated({
                tenantId: tenantObjectId,
                $or: [
                    { firstName: nameRegex },
                    { lastName: nameRegex },
                    { employeeCode: nameRegex },
                ],
            }, 1, 100, '-createdAt');
            employeeIds = employees.map((e) => e._id);
            if (employeeIds.length === 0) {
                return {
                    data: [],
                    meta: { page, limit: safeLimit, total: 0, totalPages: 0 },
                };
            }
        }
        const { data, total } = await this.payrollRepository.findAllPayslipsPaginated(tenantObjectId, {
            periodId: query.periodId,
            status: query.status,
            employeeIds,
            startDate: query.startDate,
            endDate: query.endDate,
        }, page, safeLimit, sort);
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
    async getEmployeePayslips(tenantId, employeeId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const page = query.page ?? 1;
        const safeLimit = Math.min(MAX_LIMIT, query.limit ?? 20);
        const { data, total } = await this.payrollRepository.findPayslipsByEmployee(tenantObjectId, new mongoose_1.Types.ObjectId(employeeId), page, safeLimit);
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
    async getEmployeeFinanceSummary(tenantId, employeeId) {
        const summary = await this.payrollRepository.getFinanceSummaryByEmployee(new mongoose_1.Types.ObjectId(tenantId), new mongoose_1.Types.ObjectId(employeeId));
        return summary;
    }
    async getPayrollPolicy(tenantId) {
        return this.companyPoliciesService.getEffectivePolicy(tenantId);
    }
    async updatePayrollPolicy(tenantId, actorId, actorRole, dto) {
        const current = await this.companyPoliciesService.getEffectivePolicy(tenantId);
        const merged = {
            salaryCalculationMode: current.salaryCalculationMode,
            dailyRateMethod: current.dailyRateMethod,
            restDayPolicyEnabled: dto.restDayPolicyEnabled ?? current.restDayPolicyEnabled,
            monthlyRestDays: dto.monthlyRestDays ?? current.monthlyRestDays,
            unusedRestDayCompensationEnabled: dto.unusedRestDayCompensationEnabled ?? current.unusedRestDayCompensationEnabled,
            unusedRestDaysCarryForward: current.unusedRestDaysCarryForward ?? false,
            lateToleranceMinutes: current.lateToleranceMinutes ?? 15,
            earlyLeaveToleranceMinutes: current.earlyLeaveToleranceMinutes ?? 0,
            absenceDeductionEnabled: current.absenceDeductionEnabled ?? false,
        };
        return this.companyPoliciesService.updatePayrollPolicy(tenantId, actorId, actorRole, merged);
    }
    async getReport(tenantId, periodId) {
        if (!periodId)
            throw new common_1.BadRequestException('periodId is required');
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const report = await this.payrollRepository.aggregatePeriodReport(tenantObjectId, new mongoose_1.Types.ObjectId(periodId));
        return { periodId, ...report };
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payroll_repository_1.PayrollRepository,
        tax_calculation_service_1.TaxCalculationService,
        tax_configs_repository_1.TaxConfigsRepository,
        tax_configs_service_1.TaxConfigsService,
        company_tax_configs_repository_1.CompanyTaxConfigsRepository,
        employees_repository_1.EmployeesRepository,
        ot_repository_1.OTRepository,
        leave_repository_1.LeaveRepository,
        company_policies_service_1.CompanyPoliciesService,
        shifts_repository_1.ShiftsRepository,
        attendance_repository_1.AttendanceRepository])
], PayrollService);
function startOfUtcDay(date) {
    const result = new Date(date);
    result.setUTCHours(0, 0, 0, 0);
    return result;
}
function policySnapshot(policy) {
    if (policy && typeof policy === 'object' && 'toObject' in policy) {
        return policy.toObject();
    }
    return { ...policy };
}
//# sourceMappingURL=payroll.service.js.map