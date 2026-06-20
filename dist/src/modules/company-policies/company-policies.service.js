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
exports.CompanyPoliciesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const company_policies_repository_1 = require("./company-policies.repository");
const companies_repository_1 = require("../companies/companies.repository");
const plans_repository_1 = require("../plans/plans.repository");
const audit_log_service_1 = require("../audit-logs/audit-log.service");
const DEFAULT_POLICY = {
    workScheduleMode: 'UNIFORM',
    uniformSchedule: {
        startTime: '09:00',
        endTime: '18:00',
        workDays: [1, 2, 3, 4, 5],
        gracePeriodMinutes: 15,
        isOvernight: false,
    },
    salaryCalculationMode: 'MONTHLY_FIXED',
    dailyRateMethod: 'CALENDAR_30',
    restDayPolicyEnabled: false,
    monthlyRestDays: 4,
    unusedRestDayCompensationEnabled: false,
    unusedRestDaysCarryForward: false,
    lateToleranceMinutes: 15,
    earlyLeaveToleranceMinutes: 0,
    absenceDeductionEnabled: false,
};
let CompanyPoliciesService = class CompanyPoliciesService {
    repository;
    companiesRepository;
    plansRepository;
    auditLogService;
    constructor(repository, companiesRepository, plansRepository, auditLogService) {
        this.repository = repository;
        this.companiesRepository = companiesRepository;
        this.plansRepository = plansRepository;
        this.auditLogService = auditLogService;
    }
    async getEffectivePolicy(tenantId, at = new Date()) {
        return ((await this.repository.findEffectiveAt(new mongoose_1.Types.ObjectId(tenantId), at)) ?? { tenantId, effectiveFrom: null, ...DEFAULT_POLICY });
    }
    async updateAttendancePolicy(tenantId, actorId, actorRole, dto) {
        if (dto.workScheduleMode === 'UNIFORM' && !dto.uniformSchedule) {
            throw new common_1.BadRequestException('uniformSchedule is required for UNIFORM mode');
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
    async updatePayrollPolicy(tenantId, actorId, actorRole, dto) {
        if (dto.restDayPolicyEnabled || dto.unusedRestDayCompensationEnabled) {
            await this.assertFeature(tenantId, 'restDayCompensation');
        }
        if (!dto.restDayPolicyEnabled && dto.unusedRestDayCompensationEnabled) {
            throw new common_1.BadRequestException('Rest-day compensation requires the rest-day policy');
        }
        return this.createVersion(tenantId, actorId, actorRole, {
            ...dto,
            effectiveFrom: dto.effectiveFrom
                ? new Date(dto.effectiveFrom)
                : new Date(),
        });
    }
    async createVersion(tenantId, actorId, actorRole, changes) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const previous = await this.repository.findLatest(tenantObjectId);
        const previousData = previous?.toObject() ?? DEFAULT_POLICY;
        const { _id: _previousId, id: _previousPublicId, createdAt: _createdAt, ...base } = previousData;
        const policy = await this.repository.create({
            ...base,
            ...changes,
            tenantId: tenantObjectId,
            createdBy: new mongoose_1.Types.ObjectId(actorId),
        });
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole,
            action: 'UPDATE_COMPANY_POLICY',
            module: 'company-policies',
            targetId: policy._id,
            before: previous
                ? previous.toObject()
                : DEFAULT_POLICY,
            after: changes,
        });
        return policy;
    }
    async assertFeature(tenantId, feature) {
        const company = await this.companiesRepository.findById(tenantId);
        if (!company?.planId)
            throw new common_1.ForbiddenException('Feature is not available in the current plan');
        const plan = await this.plansRepository.findById(company.planId.toString());
        if (!plan?.features?.[feature]) {
            throw new common_1.ForbiddenException(`Feature ${feature} is not available in the current plan`);
        }
    }
};
exports.CompanyPoliciesService = CompanyPoliciesService;
exports.CompanyPoliciesService = CompanyPoliciesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [company_policies_repository_1.CompanyPoliciesRepository,
        companies_repository_1.CompaniesRepository,
        plans_repository_1.PlansRepository,
        audit_log_service_1.AuditLogService])
], CompanyPoliciesService);
//# sourceMappingURL=company-policies.service.js.map