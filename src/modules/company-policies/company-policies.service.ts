import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyPoliciesRepository } from './company-policies.repository';
import { CompaniesRepository } from '../companies/companies.repository';
import { PlansRepository } from '../plans/plans.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { UpdateAttendancePolicyDto } from './dto/update-attendance-policy.dto';
import { UpdatePayrollPolicyDto } from './dto/update-payroll-policy.dto';
import type { CompanyPolicy } from './schemas/company-policy.schema';
import type { PlanFeature } from '../plans/schemas/plan.schema';

const DEFAULT_POLICY = {
  workScheduleMode: 'UNIFORM' as const,
  uniformSchedule: {
    startTime: '09:00',
    endTime: '18:00',
    workDays: [1, 2, 3, 4, 5],
    gracePeriodMinutes: 15,
    isOvernight: false,
  },
  salaryCalculationMode: 'MONTHLY_FIXED' as const,
  dailyRateMethod: 'CALENDAR_30' as const,
  restDayPolicyEnabled: false,
  monthlyRestDays: 4,
  unusedRestDayCompensationEnabled: false,
  unusedRestDaysCarryForward: false,
  lateToleranceMinutes: 15,
  earlyLeaveToleranceMinutes: 0,
  absenceDeductionEnabled: false,
};

@Injectable()
export class CompanyPoliciesService {
  constructor(
    private readonly repository: CompanyPoliciesRepository,
    private readonly companiesRepository: CompaniesRepository,
    private readonly plansRepository: PlansRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async getEffectivePolicy(tenantId: string, at = new Date()) {
    return (
      (await this.repository.findEffectiveAt(
        new Types.ObjectId(tenantId),
        at,
      )) ?? { tenantId, effectiveFrom: null, ...DEFAULT_POLICY }
    );
  }

  async updateAttendancePolicy(
    tenantId: string,
    actorId: string,
    actorRole: string,
    dto: UpdateAttendancePolicyDto,
  ) {
    if (dto.workScheduleMode === 'UNIFORM' && !dto.uniformSchedule) {
      throw new BadRequestException(
        'uniformSchedule is required for UNIFORM mode',
      );
    }
    if (dto.workScheduleMode === 'SHIFT_BASED') {
      await this.assertFeature(tenantId, 'shiftManagement');
    }

    return this.createVersion(tenantId, actorId, actorRole, {
      workScheduleMode: dto.workScheduleMode,
      ...(dto.uniformSchedule ? { uniformSchedule: dto.uniformSchedule } : {}),
      effectiveFrom: dto.effectiveFrom
        ? new Date(dto.effectiveFrom)
        : new Date(),
    });
  }

  async updatePayrollPolicy(
    tenantId: string,
    actorId: string,
    actorRole: string,
    dto: UpdatePayrollPolicyDto,
  ) {
    if (dto.restDayPolicyEnabled || dto.unusedRestDayCompensationEnabled) {
      await this.assertFeature(tenantId, 'restDayCompensation');
    }
    if (!dto.restDayPolicyEnabled && dto.unusedRestDayCompensationEnabled) {
      throw new BadRequestException(
        'Rest-day compensation requires the rest-day policy',
      );
    }

    return this.createVersion(tenantId, actorId, actorRole, {
      ...dto,
      effectiveFrom: dto.effectiveFrom
        ? new Date(dto.effectiveFrom)
        : new Date(),
    });
  }

  private async createVersion(
    tenantId: string,
    actorId: string,
    actorRole: string,
    changes: Partial<CompanyPolicy>,
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const previous = await this.repository.findLatest(tenantObjectId);
    const previousData = previous?.toObject() ?? DEFAULT_POLICY;
    const {
      _id: _previousId,
      id: _previousPublicId,
      createdAt: _createdAt,
      ...base
    } = previousData as Record<string, unknown>;
    const policy = await this.repository.create({
      ...base,
      ...changes,
      tenantId: tenantObjectId,
      createdBy: new Types.ObjectId(actorId),
    });

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole,
      action: 'UPDATE_COMPANY_POLICY',
      module: 'company-policies',
      targetId: policy._id as Types.ObjectId,
      before: previous
        ? (previous.toObject() as unknown as Record<string, unknown>)
        : DEFAULT_POLICY,
      after: changes as Record<string, unknown>,
    });
    return policy;
  }

  private async assertFeature(tenantId: string, feature: PlanFeature) {
    const company = await this.companiesRepository.findById(tenantId);
    if (!company?.planId)
      throw new ForbiddenException(
        'Feature is not available in the current plan',
      );
    const plan = await this.plansRepository.findById(company.planId.toString());
    if (!plan?.features?.[feature]) {
      throw new ForbiddenException(
        `Feature ${feature} is not available in the current plan`,
      );
    }
  }
}
