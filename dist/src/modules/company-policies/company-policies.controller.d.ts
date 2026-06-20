import { CompanyPoliciesService } from './company-policies.service';
import { UpdateAttendancePolicyDto } from './dto/update-attendance-policy.dto';
import { UpdatePayrollPolicyDto } from './dto/update-payroll-policy.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class CompanyPoliciesController {
    private readonly service;
    constructor(service: CompanyPoliciesService);
    get(user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/company-policy.schema").CompanyPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company-policy.schema").CompanyPolicy & {
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
    updateAttendance(dto: UpdateAttendancePolicyDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/company-policy.schema").CompanyPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company-policy.schema").CompanyPolicy & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updatePayroll(dto: UpdatePayrollPolicyDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/company-policy.schema").CompanyPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/company-policy.schema").CompanyPolicy & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
