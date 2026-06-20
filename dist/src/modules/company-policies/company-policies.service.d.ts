import { Types } from 'mongoose';
import { CompanyPoliciesRepository } from './company-policies.repository';
import { CompaniesRepository } from '../companies/companies.repository';
import { PlansRepository } from '../plans/plans.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { UpdateAttendancePolicyDto } from './dto/update-attendance-policy.dto';
import { UpdatePayrollPolicyDto } from './dto/update-payroll-policy.dto';
import type { CompanyPolicy } from './schemas/company-policy.schema';
export declare class CompanyPoliciesService {
    private readonly repository;
    private readonly companiesRepository;
    private readonly plansRepository;
    private readonly auditLogService;
    constructor(repository: CompanyPoliciesRepository, companiesRepository: CompaniesRepository, plansRepository: PlansRepository, auditLogService: AuditLogService);
    getEffectivePolicy(tenantId: string, at?: Date): Promise<(import("mongoose").Document<unknown, {}, CompanyPolicy, {}, import("mongoose").DefaultSchemaOptions> & CompanyPolicy & {
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
    updateAttendancePolicy(tenantId: string, actorId: string, actorRole: string, dto: UpdateAttendancePolicyDto): Promise<import("mongoose").Document<unknown, {}, CompanyPolicy, {}, import("mongoose").DefaultSchemaOptions> & CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updatePayrollPolicy(tenantId: string, actorId: string, actorRole: string, dto: UpdatePayrollPolicyDto): Promise<import("mongoose").Document<unknown, {}, CompanyPolicy, {}, import("mongoose").DefaultSchemaOptions> & CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    private createVersion;
    private assertFeature;
}
