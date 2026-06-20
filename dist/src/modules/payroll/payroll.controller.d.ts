import { PayrollService } from './payroll.service';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';
import { QueryPayslipsDto, QueryEmployeePayslipsDto } from './dto/query-payslips.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { UpdatePayslipAdjustmentsDto } from './dto/update-payslip-adjustments.dto';
import { UpdatePayrollPolicyDto } from './dto/update-payroll-policy.dto';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    createPeriod(dto: CreatePayrollPeriodDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    listPeriods(page: string, limit: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPeriod(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    generatePayroll(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    hrReviewPeriod(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    payPeriod(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/payroll-period.schema").PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-period.schema").PayrollPeriod & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    getPeriodPayslips(id: string, page: string, limit: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAllPayslips(query: QueryPayslipsDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: import("mongoose").Types.ObjectId;
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
    getPayslipById(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updatePayslipAdjustments(id: string, dto: UpdatePayslipAdjustmentsDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    getEmployeePayslips(employeeId: string, query: QueryEmployeePayslipsDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: import("mongoose").Types.ObjectId;
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
    getEmployeeFinanceSummary(employeeId: string, user: JwtPayload): Promise<{
        data: {
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
        };
    }>;
    getMyPayslips(page: string, limit: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyPayslip(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/payslip.schema").Payslip, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payslip.schema").Payslip & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getReport(periodId: string, user: JwtPayload): Promise<{
        data: any;
    }>;
    getPolicy(user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../company-policies/schemas/company-policy.schema").CompanyPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("../company-policies/schemas/company-policy.schema").CompanyPolicy & {
            _id: import("mongoose").Types.ObjectId;
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
        };
    }>;
    updatePolicy(dto: UpdatePayrollPolicyDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("../company-policies/schemas/company-policy.schema").CompanyPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("../company-policies/schemas/company-policy.schema").CompanyPolicy & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
