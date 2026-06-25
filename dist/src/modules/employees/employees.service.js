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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const mongoose_1 = require("mongoose");
const employees_repository_1 = require("./employees.repository");
const users_repository_1 = require("../users/users.repository");
const companies_repository_1 = require("../companies/companies.repository");
const plans_repository_1 = require("../plans/plans.repository");
const audit_log_service_1 = require("../audit-logs/audit-log.service");
const documents_service_1 = require("../documents/documents.service");
const BCRYPT_ROUNDS = 12;
const ASSIGNABLE_ROLES = {
    COMPANY_OWNER: ['HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR', 'STAFF'],
    HR_ADMIN: ['BRANCH_MANAGER', 'SUPERVISOR', 'STAFF'],
};
function assertCanAssignRole(actorRole, targetRole) {
    const allowed = ASSIGNABLE_ROLES[actorRole] ?? [];
    if (!allowed.includes(targetRole)) {
        throw new common_1.ForbiddenException(`ບໍ່ສາມາດກຳນົດ role ${targetRole} ໄດ້`);
    }
}
function normalizeRef(field) {
    if (!field)
        return null;
    if (typeof field === 'object' && 'name' in field) {
        return {
            id: field._id.toString(),
            name: field.name,
        };
    }
    return null;
}
function extractRole(userId) {
    if (!userId)
        return null;
    if (typeof userId === 'object' && 'role' in userId) {
        return userId.role ?? null;
    }
    return null;
}
function toEmployeeResponse(doc) {
    const obj = doc.toJSON();
    const rawBranch = doc.branchId;
    const rawDept = doc.departmentId;
    const rawPos = doc.positionId;
    const branchNorm = normalizeRef(rawBranch);
    const deptNorm = normalizeRef(rawDept);
    const posNorm = normalizeRef(rawPos);
    const role = extractRole(doc.userId);
    return {
        ...obj,
        branchId: branchNorm?.id ?? null,
        departmentId: deptNorm?.id ?? null,
        positionId: posNorm?.id ?? null,
        branch: branchNorm,
        department: deptNorm,
        position: posNorm,
        role,
    };
}
const MAX_LIMIT = 100;
function buildListFilter(currentUser, query, supervisorEmployeeId) {
    const tenantObjectId = new mongoose_1.Types.ObjectId(currentUser.companyId);
    const baseFilter = { tenantId: tenantObjectId };
    if (query.status)
        baseFilter.status = query.status;
    if (currentUser.role === 'BRANCH_MANAGER' && currentUser.branchId) {
        baseFilter.branchId = new mongoose_1.Types.ObjectId(currentUser.branchId);
    }
    else if (query.branchId) {
        baseFilter.branchId = new mongoose_1.Types.ObjectId(query.branchId);
    }
    if (query.departmentId)
        baseFilter.departmentId = new mongoose_1.Types.ObjectId(query.departmentId);
    if (currentUser.role === 'SUPERVISOR') {
        if (!supervisorEmployeeId)
            throw new common_1.ForbiddenException('Employee profile is required');
        baseFilter.$or = [
            { managerId: supervisorEmployeeId },
            { supervisorId: supervisorEmployeeId },
        ];
    }
    if (query.search) {
        const searchRegex = { $regex: query.search, $options: 'i' };
        const searchConditions = [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { firstNameEn: searchRegex },
            { lastNameEn: searchRegex },
            { nickname: searchRegex },
            { employeeCode: searchRegex },
        ];
        if (baseFilter.$or) {
            baseFilter.$and = [{ $or: baseFilter.$or }, { $or: searchConditions }];
            delete baseFilter.$or;
        }
        else {
            baseFilter.$or = searchConditions;
        }
    }
    return baseFilter;
}
let EmployeesService = class EmployeesService {
    employeesRepository;
    usersRepository;
    companiesRepository;
    plansRepository;
    auditLogService;
    documentsService;
    constructor(employeesRepository, usersRepository, companiesRepository, plansRepository, auditLogService, documentsService) {
        this.employeesRepository = employeesRepository;
        this.usersRepository = usersRepository;
        this.companiesRepository = companiesRepository;
        this.plansRepository = plansRepository;
        this.auditLogService = auditLogService;
        this.documentsService = documentsService;
    }
    async create(currentUser, dto) {
        const tenantId = currentUser.companyId;
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const company = await this.companiesRepository.findById(tenantId);
        if (!company?.planId) {
            throw new common_1.ForbiddenException('Company package is required');
        }
        const plan = await this.plansRepository.findById(company.planId.toString());
        if (!plan?.isActive) {
            throw new common_1.ForbiddenException('Company package is not active');
        }
        const employeeCount = await this.employeesRepository.countByTenant(tenantObjectId);
        if (employeeCount >= plan.maxEmployees) {
            throw new common_1.ForbiddenException('ຮອດຂີດຈຳກັດພະນັກງານຂອງ package');
        }
        const employeeCode = await this.resolveEmployeeCode(dto.employeeCode, tenantObjectId, company.companyCode, company.name);
        const employee = await this.employeesRepository
            .create(tenantObjectId, { ...dto, employeeCode })
            .catch((err) => {
            if (err.code === 11000) {
                throw new common_1.ConflictException('Phone number already registered in this company');
            }
            throw err;
        });
        const assignedRole = dto.role ?? 'STAFF';
        assertCanAssignRole(currentUser.role, assignedRole);
        const rawPassword = dto.initialPassword;
        const hashedPassword = await bcrypt.hash(rawPassword, BCRYPT_ROUNDS);
        const alreadyHasUser = await this.usersRepository.existsByPhoneAndCompany(dto.phone, tenantObjectId);
        if (!alreadyHasUser) {
            const user = await this.usersRepository.create({
                phone: dto.phone,
                name: `${dto.firstName} ${dto.lastName}`,
                password: hashedPassword,
                role: assignedRole,
                companyId: tenantObjectId,
                branchId: dto.branchId ? new mongoose_1.Types.ObjectId(dto.branchId) : null,
                isActive: true,
            });
            await this.employeesRepository.linkUser(employee._id.toString(), tenantObjectId, user._id);
        }
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId: currentUser.sub,
            actorRole: currentUser.role,
            action: 'CREATE_EMPLOYEE',
            module: 'employees',
            targetId: employee._id,
            after: {
                employeeCode,
                phone: dto.phone,
                firstName: dto.firstName,
                lastName: dto.lastName,
            },
        });
        return employee;
    }
    async resolveEmployeeCode(provided, tenantId, companyCode, companyName) {
        if (provided) {
            const duplicate = await this.employeesRepository.findByEmployeeCode(tenantId, provided);
            if (duplicate)
                throw new common_1.ConflictException(`Employee code "${provided}" already exists`);
            return provided;
        }
        const derived = companyName.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3) || 'EMP';
        const code = companyCode ?? derived;
        const year = new Date().getFullYear();
        return this.employeesRepository.generateNextCode(tenantId, code, year);
    }
    async list(currentUser, query) {
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const sort = query.sort ?? '-createdAt';
        const supervisor = currentUser.role === 'SUPERVISOR'
            ? await this.employeesRepository.findByUserIdAndTenant(new mongoose_1.Types.ObjectId(currentUser.sub), new mongoose_1.Types.ObjectId(currentUser.companyId))
            : null;
        const filter = buildListFilter(currentUser, query, supervisor?._id);
        const { employees, total } = await this.employeesRepository.findPaginated(filter, page, limit, sort);
        return {
            data: employees.map(toEmployeeResponse),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getOne(currentUser, id) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const employee = await this.employeesRepository.findById(id, tenantObjectId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        if (currentUser.role === 'STAFF') {
            const isOwnRecord = employee.userId?.toString() === currentUser.sub;
            if (!isOwnRecord)
                throw new common_1.ForbiddenException('Access denied');
        }
        if (currentUser.role === 'BRANCH_MANAGER') {
            const employeeBranchId = normalizeObjectId(employee.branchId);
            if (!currentUser.branchId || employeeBranchId !== currentUser.branchId) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        if (currentUser.role === 'SUPERVISOR') {
            const supervisor = await this.employeesRepository.findByUserIdAndTenant(new mongoose_1.Types.ObjectId(currentUser.sub), tenantObjectId);
            const supervisorId = supervisor?._id?.toString();
            if (!supervisorId ||
                (employee.managerId?.toString() !== supervisorId &&
                    employee.supervisorId?.toString() !== supervisorId)) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        return toEmployeeResponse(employee);
    }
    async update(currentUser, id, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const existing = await this.employeesRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Employee not found');
        if (dto.phone && dto.phone !== existing.phone) {
            const phoneTaken = await this.usersRepository.existsByPhoneAndCompany(dto.phone, tenantObjectId);
            if (phoneTaken)
                throw new common_1.ConflictException('Phone number already registered in this company');
        }
        const updated = await this.employeesRepository.update(id, tenantObjectId, dto);
        if (existing.userId) {
            const rawUid = existing.userId;
            const userId = typeof rawUid === 'object' && '_id' in rawUid
                ? rawUid._id.toString()
                : rawUid.toString();
            if (dto.phone && dto.phone !== existing.phone) {
                await this.usersRepository.updatePhone(userId, dto.phone);
            }
            if (dto.newPassword) {
                const hashed = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
                await this.usersRepository.updatePassword(userId, hashed);
            }
        }
        const { newPassword: _pw, ...auditAfter } = dto;
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId: currentUser.sub,
            actorRole: currentUser.role,
            action: 'UPDATE_EMPLOYEE',
            module: 'employees',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: {
                firstName: existing.firstName,
                lastName: existing.lastName,
                phone: existing.phone,
            },
            after: auditAfter,
        });
        return updated ? toEmployeeResponse(updated) : null;
    }
    async deactivate(currentUser, id) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const existing = await this.employeesRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Employee not found');
        const updated = await this.employeesRepository.setStatus(id, tenantObjectId, 'INACTIVE');
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId: currentUser.sub,
            actorRole: currentUser.role,
            action: 'DEACTIVATE_EMPLOYEE',
            module: 'employees',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { status: existing.status },
            after: { status: 'INACTIVE' },
        });
        return updated;
    }
    async softDelete(currentUser, id) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const existing = await this.employeesRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Employee not found');
        await this.employeesRepository.softDelete(id, tenantObjectId);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId: currentUser.sub,
            actorRole: currentUser.role,
            action: 'DELETE_EMPLOYEE',
            module: 'employees',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { firstName: existing.firstName, lastName: existing.lastName },
            after: { isDeleted: true },
        });
        return { message: 'Employee deleted successfully' };
    }
    async reactivate(currentUser, id) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const existing = await this.employeesRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Employee not found');
        const updated = await this.employeesRepository.setStatus(id, tenantObjectId, 'ACTIVE');
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId: currentUser.sub,
            actorRole: currentUser.role,
            action: 'REACTIVATE_EMPLOYEE',
            module: 'employees',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { status: existing.status },
            after: { status: 'ACTIVE' },
        });
        return updated;
    }
    async uploadDocument(currentUser, id, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const employee = await this.employeesRepository.findById(id, tenantObjectId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        return this.documentsService.addDocument({
            tenantId: tenantObjectId,
            employeeId: employee._id,
            fileName: dto.fileName,
            fileUrl: dto.fileUrl,
            fileType: dto.fileType,
            documentType: dto.documentType,
            description: dto.description,
            uploadedBy: new mongoose_1.Types.ObjectId(currentUser.sub),
        });
    }
    async changeRole(currentUser, employeeId, newRole) {
        assertCanAssignRole(currentUser.role, newRole);
        const tenantObjectId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const employee = await this.employeesRepository.findById(employeeId, tenantObjectId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        if (!employee.userId)
            throw new common_1.ForbiddenException('Employee has no linked user account');
        const rawUidRole = employee.userId;
        const userId = typeof rawUidRole === 'object' && '_id' in rawUidRole
            ? rawUidRole._id.toString()
            : rawUidRole.toString();
        await this.usersRepository.updateRole(userId, newRole);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId: currentUser.sub,
            actorRole: currentUser.role,
            action: 'CHANGE_ROLE',
            module: 'employees',
            targetId: new mongoose_1.Types.ObjectId(employeeId),
            after: { role: newRole },
        });
        return { message: 'Role updated successfully', role: newRole };
    }
    async updateMyProfile(currentUser, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const userObjectId = new mongoose_1.Types.ObjectId(currentUser.sub);
        const updated = await this.employeesRepository.updateByUserIdAndTenant(userObjectId, tenantObjectId, dto);
        if (!updated)
            throw new common_1.NotFoundException('Employee profile not found');
        return toEmployeeResponse(updated);
    }
    async changePassword(currentUser, employeeId, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const employee = await this.employeesRepository.findById(employeeId, tenantObjectId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        if (!employee.userId) {
            throw new common_1.ForbiddenException('Employee has no linked user account');
        }
        const rawUserId = employee.userId;
        const userId = typeof rawUserId === 'object' && '_id' in rawUserId
            ? rawUserId._id.toString()
            : rawUserId.toString();
        if (currentUser.role === 'STAFF' && userId !== currentUser.sub) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const userWithPassword = await this.usersRepository.findByIdWithSensitive(userId);
        if (!userWithPassword)
            throw new common_1.NotFoundException('User account not found');
        const isStaff = currentUser.role === 'STAFF';
        if (isStaff) {
            if (!dto.currentPassword)
                throw new common_1.BadRequestException('กรุณาระบุรหัสผ่านปัจจุบัน');
            const isPasswordCorrect = await bcrypt.compare(dto.currentPassword, userWithPassword.password);
            if (!isPasswordCorrect)
                throw new common_1.BadRequestException('รหัสผ่านปัจจุบันไม่ถูกต้อง');
        }
        const hashedNewPassword = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
        await this.usersRepository.updatePassword(userId, hashedNewPassword);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId: currentUser.sub,
            actorRole: currentUser.role,
            action: 'CHANGE_PASSWORD',
            module: 'employees',
            targetId: new mongoose_1.Types.ObjectId(employeeId),
        });
        return { message: 'Password changed successfully' };
    }
    async getDocuments(currentUser, id) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const employee = await this.employeesRepository.findById(id, tenantObjectId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        if (currentUser.role === 'STAFF') {
            const isOwnRecord = employee.userId?.toString() === currentUser.sub;
            if (!isOwnRecord)
                throw new common_1.ForbiddenException('Access denied');
        }
        return this.documentsService.getEmployeeDocuments(employee._id, tenantObjectId);
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employees_repository_1.EmployeesRepository,
        users_repository_1.UsersRepository,
        companies_repository_1.CompaniesRepository,
        plans_repository_1.PlansRepository,
        audit_log_service_1.AuditLogService,
        documents_service_1.DocumentsService])
], EmployeesService);
function normalizeObjectId(value) {
    if (!value)
        return null;
    if (typeof value === 'object' &&
        '_id' in value) {
        return String(value._id);
    }
    return String(value);
}
//# sourceMappingURL=employees.service.js.map