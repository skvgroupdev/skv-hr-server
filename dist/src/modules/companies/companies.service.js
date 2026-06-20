"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const mongoose_1 = require("mongoose");
const companies_repository_1 = require("./companies.repository");
const users_repository_1 = require("../users/users.repository");
const plans_repository_1 = require("../plans/plans.repository");
const audit_log_service_1 = require("../audit-logs/audit-log.service");
const BCRYPT_ROUNDS = 12;
const MAX_LIMIT = 100;
let CompaniesService = class CompaniesService {
    companiesRepository;
    usersRepository;
    plansRepository;
    auditLogService;
    constructor(companiesRepository, usersRepository, plansRepository, auditLogService) {
        this.companiesRepository = companiesRepository;
        this.usersRepository = usersRepository;
        this.plansRepository = plansRepository;
        this.auditLogService = auditLogService;
    }
    async createCompany(dto, actorId, actorRole) {
        if (dto.planId) {
            this.assertObjectId(dto.planId, 'Invalid plan id');
            const plan = await this.plansRepository.findById(dto.planId);
            if (!plan || !plan.isActive) {
                throw new common_1.BadRequestException('Active plan not found');
            }
        }
        const companyCode = dto.companyCode ?? this.deriveCompanyCode(dto.name);
        const company = await this.companiesRepository.create({ ...dto, companyCode });
        await this.auditLogService.log({
            actorId,
            actorRole,
            action: 'CREATE_COMPANY',
            module: 'companies',
            targetId: company._id,
            after: { name: company.name, status: company.status, planId: dto.planId },
        });
        return company;
    }
    async listCompanies(query) {
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const sort = query.sort ?? '-createdAt';
        const { companies, total } = await this.companiesRepository.findPaginated(page, limit, sort);
        const totalPages = Math.ceil(total / limit);
        return {
            data: companies,
            meta: { page, limit, total, totalPages },
        };
    }
    async getCompany(id) {
        this.assertObjectId(id, 'Invalid company id');
        const company = await this.companiesRepository.findByIdWithPlan(id);
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async updateCompany(id, dto, actorId, actorRole) {
        const existing = await this.companiesRepository.findById(id);
        if (!existing)
            throw new common_1.NotFoundException('Company not found');
        const updated = await this.companiesRepository.update(id, dto);
        await this.auditLogService.log({
            actorId,
            actorRole,
            action: 'UPDATE_COMPANY',
            module: 'companies',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { name: existing.name },
            after: dto,
        });
        return updated;
    }
    async activateCompany(id, actorId, actorRole) {
        const company = await this.companiesRepository.findById(id);
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        const updated = await this.companiesRepository.updateStatus(id, 'ACTIVE');
        await this.auditLogService.log({
            actorId,
            actorRole,
            action: 'ACTIVATE_COMPANY',
            module: 'companies',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { status: company.status },
            after: { status: 'ACTIVE' },
        });
        return updated;
    }
    async suspendCompany(id, actorId, actorRole) {
        const company = await this.companiesRepository.findById(id);
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        const updated = await this.companiesRepository.updateStatus(id, 'SUSPENDED');
        await this.auditLogService.log({
            actorId,
            actorRole,
            action: 'SUSPEND_COMPANY',
            module: 'companies',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { status: company.status },
            after: { status: 'SUSPENDED' },
        });
        return updated;
    }
    async assignPlan(companyId, planId, startDate, endDate, isPaid, actorId) {
        this.assertObjectId(companyId, 'Invalid company id');
        this.assertObjectId(planId, 'Invalid plan id');
        const company = await this.companiesRepository.findById(companyId);
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        const plan = await this.plansRepository.findById(planId);
        if (!plan || !plan.isActive)
            throw new common_1.NotFoundException('Active plan not found');
        const parsedStartDate = this.parseDate(startDate, 'Invalid subscription start date');
        const parsedEndDate = this.parseDate(endDate, 'Invalid subscription end date');
        if (parsedEndDate <= parsedStartDate) {
            throw new common_1.BadRequestException('Subscription end date must be after start date');
        }
        const updated = await this.companiesRepository.update(companyId, {
            planId: new mongoose_1.Types.ObjectId(planId),
            subscription: {
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                status: 'ACTIVE',
                isPaid,
            },
            status: 'ACTIVE',
        });
        await this.auditLogService.log({
            actorId,
            actorRole: 'SUPER_ADMIN',
            action: 'ASSIGN_PLAN',
            module: 'companies',
            targetId: new mongoose_1.Types.ObjectId(companyId),
            before: {
                planId: company.planId?.toString() ?? null,
                subscription: company.subscription,
            },
            after: { planId, startDate, endDate, isPaid },
        });
        return updated;
    }
    async updateSubscription(companyId, dto, actorId) {
        this.assertObjectId(companyId, 'Invalid company id');
        const company = await this.companiesRepository.findById(companyId);
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        if (!company.planId) {
            throw new common_1.BadRequestException('Assign a plan before updating subscription');
        }
        const startDate = dto.startDate
            ? this.parseDate(dto.startDate, 'Invalid subscription start date')
            : company.subscription?.startDate;
        const endDate = dto.endDate
            ? this.parseDate(dto.endDate, 'Invalid subscription end date')
            : company.subscription?.endDate;
        if (startDate && endDate && endDate <= startDate) {
            throw new common_1.BadRequestException('Subscription end date must be after start date');
        }
        const subscriptionStatus = dto.status ?? company.subscription?.status ?? 'ACTIVE';
        const updated = await this.companiesRepository.update(companyId, {
            subscription: {
                startDate,
                endDate,
                status: subscriptionStatus,
                isPaid: dto.isPaid ?? company.subscription?.isPaid ?? false,
            },
            status: this.mapSubscriptionToCompanyStatus(subscriptionStatus),
        });
        await this.auditLogService.log({
            actorId,
            actorRole: 'SUPER_ADMIN',
            action: 'UPDATE_SUBSCRIPTION',
            module: 'companies',
            targetId: new mongoose_1.Types.ObjectId(companyId),
            before: { subscription: company.subscription },
            after: dto,
        });
        return updated;
    }
    async extendSubscription(companyId, dto, actorId) {
        this.assertObjectId(companyId, 'Invalid company id');
        const company = await this.companiesRepository.findById(companyId);
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        const endDate = this.parseDate(dto.endDate, 'Invalid subscription end date');
        const currentEndDate = company.subscription?.endDate;
        if (currentEndDate && endDate <= currentEndDate) {
            throw new common_1.BadRequestException('New end date must be after current end date');
        }
        return this.updateSubscription(companyId, {
            endDate: dto.endDate,
            status: 'ACTIVE',
            isPaid: dto.isPaid ?? company.subscription?.isPaid ?? false,
        }, actorId);
    }
    async getUsage(companyId) {
        this.assertObjectId(companyId, 'Invalid company id');
        const company = await this.companiesRepository.findById(companyId);
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        const companyObjectId = new mongoose_1.Types.ObjectId(companyId);
        const [employees, branches, plan] = await Promise.all([
            this.companiesRepository.countActiveEmployees(companyObjectId),
            this.companiesRepository.countActiveBranches(companyObjectId),
            company.planId
                ? this.plansRepository.findById(company.planId.toString())
                : Promise.resolve(null),
        ]);
        return {
            companyId,
            employees,
            branches,
            storageUsedGB: 0,
            limits: plan
                ? {
                    maxEmployees: plan.maxEmployees,
                    maxBranches: plan.maxBranches,
                    maxStorageGB: plan.maxStorageGB,
                }
                : null,
        };
    }
    async getSuperDashboard() {
        const { companies, total } = await this.companiesRepository.findPaginated(1, 1000, '-createdAt');
        const activeCount = companies.filter((c) => c.status === 'ACTIVE').length;
        const trialCount = companies.filter((c) => c.status === 'TRIAL').length;
        const suspendedCount = companies.filter((c) => c.status === 'SUSPENDED').length;
        return { total, active: activeCount, trial: trialCount, suspended: suspendedCount };
    }
    async createOwner(companyId, dto, actorId, actorRole) {
        const company = await this.companiesRepository.findById(companyId);
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        const companyObjectId = company._id;
        const alreadyExists = await this.usersRepository.existsByPhoneAndCompany(dto.phone, companyObjectId);
        if (alreadyExists)
            throw new common_1.ConflictException('Phone already registered in this company');
        const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        const owner = await this.usersRepository.create({
            phone: dto.phone,
            name: dto.name,
            password: hashedPassword,
            role: 'COMPANY_OWNER',
            companyId: companyObjectId,
            branchId: null,
            isActive: true,
        });
        await this.auditLogService.log({
            tenantId: companyObjectId,
            actorId,
            actorRole,
            action: 'CREATE_USER',
            module: 'companies',
            targetId: owner._id,
            after: { phone: dto.phone, role: 'COMPANY_OWNER', companyId },
        });
        return owner;
    }
    deriveCompanyCode(companyName) {
        return companyName
            .replace(/[^A-Za-z]/g, '')
            .toUpperCase()
            .slice(0, 3) || 'COM';
    }
    assertObjectId(value, message) {
        if (!mongoose_1.Types.ObjectId.isValid(value))
            throw new common_1.BadRequestException(message);
    }
    parseDate(value, message) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime()))
            throw new common_1.BadRequestException(message);
        return date;
    }
    mapSubscriptionToCompanyStatus(status) {
        if (status === 'TRIAL')
            return 'TRIAL';
        if (status === 'EXPIRED' || status === 'CANCELLED')
            return 'EXPIRED';
        if (status === 'SUSPENDED')
            return 'SUSPENDED';
        return 'ACTIVE';
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [companies_repository_1.CompaniesRepository,
        users_repository_1.UsersRepository,
        plans_repository_1.PlansRepository,
        audit_log_service_1.AuditLogService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map