import { Types } from 'mongoose';
import { PayrollRepository } from './payroll.repository';
import { TaxCalculationService } from '../tax-configs/tax-calculation.service';
import { TaxConfigsRepository } from '../tax-configs/tax-configs.repository';
import { TaxConfigsService } from '../tax-configs/tax-configs.service';
import { CompanyTaxConfigsRepository } from '../tax-configs/company-tax-configs.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { OTRepository } from '../ot/ot.repository';
import { LeaveRepository } from '../leave/leave.repository';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';
import { CompanyPoliciesService } from '../company-policies/company-policies.service';
import { UpdatePayrollPolicyDto } from './dto/update-payroll-policy.dto';
import { ShiftsRepository } from '../shifts/shifts.repository';
import { UpdatePayslipAdjustmentsDto } from './dto/update-payslip-adjustments.dto';
import { AttendanceRepository } from '../attendance/attendance.repository';
export declare class PayrollService {
    private readonly payrollRepository;
    private readonly taxCalculationService;
    private readonly taxConfigsRepository;
    private readonly taxConfigsService;
    private readonly companyTaxConfigsRepository;
    private readonly employeesRepository;
    private readonly otRepository;
    private readonly leaveRepository;
    private readonly companyPoliciesService;
    private readonly shiftsRepository;
    private readonly attendanceRepository;
    constructor(payrollRepository: PayrollRepository, taxCalculationService: TaxCalculationService, taxConfigsRepository: TaxConfigsRepository, taxConfigsService: TaxConfigsService, companyTaxConfigsRepository: CompanyTaxConfigsRepository, employeesRepository: EmployeesRepository, otRepository: OTRepository, leaveRepository: LeaveRepository, companyPoliciesService: CompanyPoliciesService, shiftsRepository: ShiftsRepository, attendanceRepository: AttendanceRepository);
    createPeriod(tenantId: string, userId: string, dto: CreatePayrollPeriodDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    listPeriods(tenantId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPeriod(tenantId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    generatePayroll(tenantId: string, periodId: string, actorId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    private resolveTaxConfig;
    private applyTaxModeAdjustments;
    approvePeriod(tenantId: string, periodId: string, actorId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    hrReviewPeriod(tenantId: string, periodId: string, actorId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    payPeriod(tenantId: string, periodId: string, actorId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updatePayslipAdjustments(tenantId: string, payslipId: string, actorId: string, dto: UpdatePayslipAdjustmentsDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    private countScheduledDays;
    lockPeriod(tenantId: string, periodId: string, actorId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getPeriodPayslips(tenantId: string, periodId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPayslipById(tenantId: string, payslipId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyPayslips(tenantId: string, userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyPayslip(tenantId: string, userId: string, payslipId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllPayslips(tenantId: string, query: {
        page?: number;
        limit?: number;
        sort?: string;
        periodId?: string;
        status?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getEmployeePayslips(tenantId: string, employeeId: string, query: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getEmployeeFinanceSummary(tenantId: string, employeeId: string): Promise<{
        totalPayslips: number;
        totalNetSalary: number;
        totalGrossSalary: number;
        averageNetSalary: number;
        monthlyBreakdown: {
            year: number;
            month: number;
            netSalary: number;
            grossSalary: number;
        }[];
    }>;
    getPayrollPolicy(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, import("../company-policies/schemas/company-policy.schema").CompanyPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("../company-policies/schemas/company-policy.schema").CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | {
        workScheduleMode: "UNIFORM";
        uniformSchedule: {
            startTime: string;
            endTime: string;
            workDays: number[];
            gracePeriodMinutes: number;
            isOvernight: boolean;
        };
        salaryCalculationMode: "MONTHLY_FIXED";
        dailyRateMethod: "CALENDAR_30";
        restDayPolicyEnabled: boolean;
        monthlyRestDays: number;
        unusedRestDayCompensationEnabled: boolean;
        unusedRestDaysCarryForward: boolean;
        lateToleranceMinutes: number;
        earlyLeaveToleranceMinutes: number;
        absenceDeductionEnabled: boolean;
        tenantId: string;
        effectiveFrom: null;
    }>;
    updatePayrollPolicy(tenantId: string, actorId: string, actorRole: string, dto: UpdatePayrollPolicyDto): Promise<import("mongoose").Document<unknown, {}, import("../company-policies/schemas/company-policy.schema").CompanyPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("../company-policies/schemas/company-policy.schema").CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getReport(tenantId: string, periodId?: string): Promise<any>;
}
