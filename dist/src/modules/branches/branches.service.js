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
exports.BranchesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const branches_repository_1 = require("./branches.repository");
const audit_log_service_1 = require("../audit-logs/audit-log.service");
const employees_repository_1 = require("../employees/employees.repository");
const users_repository_1 = require("../users/users.repository");
const companies_repository_1 = require("../companies/companies.repository");
const plans_repository_1 = require("../plans/plans.repository");
const MAX_LIMIT = 100;
let BranchesService = class BranchesService {
    branchesRepository;
    auditLogService;
    employeesRepository;
    usersRepository;
    companiesRepository;
    plansRepository;
    constructor(branchesRepository, auditLogService, employeesRepository, usersRepository, companiesRepository, plansRepository) {
        this.branchesRepository = branchesRepository;
        this.auditLogService = auditLogService;
        this.employeesRepository = employeesRepository;
        this.usersRepository = usersRepository;
        this.companiesRepository = companiesRepository;
        this.plansRepository = plansRepository;
    }
    async create(tenantId, dto, actorId, actorRole) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const company = await this.companiesRepository.findById(tenantId);
        if (!company?.planId) {
            throw new common_1.ForbiddenException('Company package is required');
        }
        const plan = await this.plansRepository.findById(company.planId.toString());
        if (!plan?.isActive) {
            throw new common_1.ForbiddenException('Company package is not active');
        }
        const activeBranchCount = await this.branchesRepository.countByTenant(tenantObjectId);
        if (activeBranchCount >= plan.maxBranches) {
            throw new common_1.ForbiddenException('ຮອດຂີດຈຳກັດສາຂາຂອງ package');
        }
        const branch = await this.branchesRepository.create(tenantObjectId, dto);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole,
            action: 'CREATE_BRANCH',
            module: 'branches',
            targetId: branch._id,
            after: { name: branch.name },
        });
        return branch;
    }
    async list(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const sort = query.sort ?? '-createdAt';
        const filter = query.isActive !== undefined ? { isActive: query.isActive } : {};
        const { branches, total } = await this.branchesRepository.findPaginated(tenantObjectId, page, limit, sort, filter);
        return {
            data: branches,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getOne(tenantId, id) {
        const branch = await this.branchesRepository.findById(id, new mongoose_1.Types.ObjectId(tenantId));
        if (!branch)
            throw new common_1.NotFoundException('Branch not found');
        return branch;
    }
    async update(tenantId, id, dto, actorId, actorRole) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.branchesRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Branch not found');
        const updated = await this.branchesRepository.update(id, tenantObjectId, dto);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole,
            action: 'UPDATE_BRANCH',
            module: 'branches',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { name: existing.name },
            after: dto,
        });
        return updated;
    }
    async softDelete(tenantId, id, actorId, actorRole) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.branchesRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Branch not found');
        const updated = await this.branchesRepository.setActive(id, tenantObjectId, false);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole,
            action: 'DEACTIVATE_BRANCH',
            module: 'branches',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { isActive: true },
            after: { isActive: false },
        });
        return updated;
    }
    async activate(tenantId, id, actorId, actorRole) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.branchesRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Branch not found');
        const updated = await this.branchesRepository.setActive(id, tenantObjectId, true);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole,
            action: 'ACTIVATE_BRANCH',
            module: 'branches',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { isActive: false },
            after: { isActive: true },
        });
        return updated;
    }
    async deactivate(tenantId, id, actorId, actorRole) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.branchesRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Branch not found');
        const updated = await this.branchesRepository.setActive(id, tenantObjectId, false);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole,
            action: 'DEACTIVATE_BRANCH',
            module: 'branches',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { isActive: true },
            after: { isActive: false },
        });
        return updated;
    }
    async assignManager(tenantId, branchId, employeeId, actorId, actorRole) {
        if (!mongoose_1.Types.ObjectId.isValid(branchId) ||
            !mongoose_1.Types.ObjectId.isValid(employeeId)) {
            throw new common_1.BadRequestException('Invalid branch or employee id');
        }
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const [branch, employee] = await Promise.all([
            this.branchesRepository.findById(branchId, tenantObjectId),
            this.employeesRepository.findById(employeeId, tenantObjectId),
        ]);
        if (!branch)
            throw new common_1.NotFoundException('Branch not found');
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        if (!employee.userId)
            throw new common_1.BadRequestException('Employee has no linked user account');
        await this.usersRepository.updateRoleAndBranch(employee.userId.toString(), tenantObjectId, 'BRANCH_MANAGER', branch._id);
        if (normalizeId(employee.branchId) !== branchId) {
            await this.employeesRepository.update(employeeId, tenantObjectId, {
                branchId,
            });
        }
        const updated = await this.branchesRepository.update(branchId, tenantObjectId, {
            managerId: employee.userId.toString(),
        });
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole,
            action: 'ASSIGN_BRANCH_MANAGER',
            module: 'branches',
            targetId: branch._id,
            after: { employeeId, userId: employee.userId.toString() },
        });
        return updated;
    }
};
exports.BranchesService = BranchesService;
exports.BranchesService = BranchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [branches_repository_1.BranchesRepository,
        audit_log_service_1.AuditLogService,
        employees_repository_1.EmployeesRepository,
        users_repository_1.UsersRepository,
        companies_repository_1.CompaniesRepository,
        plans_repository_1.PlansRepository])
], BranchesService);
function normalizeId(value) {
    if (!value)
        return null;
    if (typeof value === 'object' &&
        '_id' in value) {
        return String(value._id);
    }
    return String(value);
}
//# sourceMappingURL=branches.service.js.map