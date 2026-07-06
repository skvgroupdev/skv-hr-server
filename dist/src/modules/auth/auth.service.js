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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const mongoose_1 = require("mongoose");
const users_repository_1 = require("../users/users.repository");
const employees_repository_1 = require("../employees/employees.repository");
const shifts_repository_1 = require("../shifts/shifts.repository");
const audit_log_service_1 = require("../audit-logs/audit-log.service");
const companies_repository_1 = require("../companies/companies.repository");
const plans_repository_1 = require("../plans/plans.repository");
const BCRYPT_ROUNDS = 12;
let AuthService = class AuthService {
    usersRepository;
    employeesRepository;
    shiftsRepository;
    jwtService;
    configService;
    auditLogService;
    companiesRepository;
    plansRepository;
    constructor(usersRepository, employeesRepository, shiftsRepository, jwtService, configService, auditLogService, companiesRepository, plansRepository) {
        this.usersRepository = usersRepository;
        this.employeesRepository = employeesRepository;
        this.shiftsRepository = shiftsRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.auditLogService = auditLogService;
        this.companiesRepository = companiesRepository;
        this.plansRepository = plansRepository;
    }
    async login(dto, ipAddress, userAgent) {
        const user = await this.resolveUserForLogin(dto);
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            await this.auditLogService.log({
                actorId: user._id,
                actorRole: user.role,
                action: 'LOGIN_FAILED',
                module: 'auth',
                ipAddress,
                userAgent,
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.ForbiddenException('Account is inactive');
        }
        const tokens = await this.generateAndStoreTokens(user);
        await this.auditLogService.log({
            tenantId: user.companyId,
            actorId: user._id,
            actorRole: user.role,
            action: 'LOGIN',
            module: 'auth',
            ipAddress,
            userAgent,
        });
        return { ...tokens, user: await this.toUserPayload(user) };
    }
    async refresh(userId, rawRefreshToken) {
        const user = await this.usersRepository.findByIdWithSensitive(userId);
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const isTokenValid = await bcrypt.compare(rawRefreshToken, user.refreshToken);
        if (!isTokenValid) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const tokens = await this.generateAndStoreTokens(user);
        return { ...tokens, user: await this.toUserPayload(user) };
    }
    async logout(userId) {
        await this.usersRepository.updateRefreshToken(userId, null);
    }
    async getMe(userId) {
        const user = await this.usersRepository.findById(userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        const companyIdStr = user.companyId?.toString();
        const [features, subscriptionSummary] = await Promise.all([
            this.getFeatures(companyIdStr),
            this.getSubscriptionSummary(companyIdStr),
        ]);
        const base = {
            id: user._id.toString(),
            phone: user.phone,
            name: user.name,
            role: user.role,
            companyId: companyIdStr ?? null,
            branchId: user.branchId?.toString() ?? null,
            features,
            subscriptionSummary,
        };
        const employee = await this.employeesRepository.findByUserId(user._id);
        if (!employee)
            return base;
        const assignment = await this.shiftsRepository.findCurrentAssignment(employee._id, user.companyId);
        const shift = assignment?.shiftId;
        const workSchedule = this.toWorkSchedule(shift);
        return { ...base, ...this.toEmployeeFields(employee), workSchedule };
    }
    toEmployeeFields(employee) {
        return {
            employeeId: employee._id.toString(),
            employeeCode: employee.employeeCode,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            avatarUrl: employee.photoUrl,
            bankName: employee.bankName,
            bankAccount: employee.bankAccount,
            position: this.toPositionRef(employee.positionId),
            department: this.toRef(employee.departmentId),
            branch: this.toRef(employee.branchId),
            startDate: employee.startDate?.toISOString(),
            employmentType: employee.employmentType,
            status: employee.status,
        };
    }
    toRef(populated) {
        if (!populated || typeof populated !== 'object')
            return undefined;
        const doc = populated;
        const id = doc._id?.toString() ?? doc.id ?? '';
        return id ? { id, name: doc.name ?? '' } : undefined;
    }
    toPositionRef(populated) {
        const ref = this.toRef(populated);
        if (!ref)
            return undefined;
        const doc = populated;
        return { ...ref, banding: doc.banding };
    }
    toWorkSchedule(shift) {
        if (!shift?.startTime || !shift?.endTime)
            return undefined;
        return { startTime: shift.startTime, endTime: shift.endTime };
    }
    async changePassword(userId, dto) {
        const user = await this.usersRepository.findByIdWithSensitive(userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        const isValid = await bcrypt.compare(dto.oldPassword, user.password);
        if (!isValid)
            throw new common_1.BadRequestException('Old password is incorrect');
        const hashed = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
        await this.usersRepository.updatePassword(userId, hashed);
        await this.usersRepository.updateRefreshToken(userId, null);
    }
    async resolveUserForLogin(dto) {
        if (!dto.companyCode) {
            const candidates = await this.usersRepository.findAllByPhone(dto.phone);
            const superAdmin = candidates.find((u) => u.role === 'SUPER_ADMIN');
            if (superAdmin) {
                return this.usersRepository.findByIdWithSensitive(superAdmin._id.toString());
            }
            if (candidates.length === 0) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            if (candidates.length === 1) {
                return this.usersRepository.findByIdWithSensitive(candidates[0]._id.toString());
            }
            throw new common_1.BadRequestException('Phone exists in multiple companies, please provide companyCode');
        }
        const companyId = new mongoose_1.Types.ObjectId(dto.companyCode);
        const user = await this.usersRepository.findByPhoneAndCompany(dto.phone, companyId);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return user;
    }
    async generateAndStoreTokens(user) {
        const payload = {
            sub: user._id.toString(),
            role: user.role,
            companyId: user.companyId?.toString() ?? null,
            branchId: user.branchId?.toString() ?? null,
        };
        const accessExpiresIn = this.configService.get('jwt.accessExpiresIn') ?? '15m';
        const refreshExpiresIn = this.configService.get('jwt.refreshExpiresIn') ?? '7d';
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('jwt.accessSecret'),
                expiresIn: accessExpiresIn,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('jwt.refreshSecret'),
                expiresIn: refreshExpiresIn,
            }),
        ]);
        const hashedRefresh = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
        await this.usersRepository.updateRefreshToken(user._id.toString(), hashedRefresh);
        return { accessToken, refreshToken };
    }
    async toUserPayload(user) {
        return {
            id: user._id.toString(),
            phone: user.phone,
            name: user.name,
            role: user.role,
            companyId: user.companyId?.toString() ?? null,
            branchId: user.branchId?.toString() ?? null,
            features: await this.getFeatures(user.companyId?.toString()),
        };
    }
    async getFeatures(companyId) {
        const plan = await this.getTenantPlan(companyId);
        if (!plan?.features)
            return undefined;
        const features = typeof plan.features
            .toObject === 'function'
            ? plan.features.toObject()
            : plan.features;
        return {
            attendance: features.attendance,
            shiftManagement: features.shiftManagement,
            attendanceAdjustment: features.attendanceAdjustment,
            outsideWork: features.outsideWork ?? true,
            leave: features.leave,
            ot: features.ot,
            payroll: features.payroll,
            restDayCompensation: features.restDayCompensation,
            advancedReport: features.advancedReport,
            announcement: features.announcement,
        };
    }
    async getSubscriptionSummary(companyId) {
        if (!companyId)
            return undefined;
        const company = await this.companiesRepository.findById(companyId);
        if (!company?.planId)
            return undefined;
        const plan = await this.resolvePlan(company.planId);
        if (!plan)
            return undefined;
        return {
            planId: plan._id.toString(),
            planName: plan.name,
            status: company.subscription?.status ?? 'TRIAL',
            endDate: company.subscription?.endDate?.toISOString() ?? null,
            isPaid: company.subscription?.isPaid ?? false,
        };
    }
    async getTenantPlan(companyId) {
        if (!companyId)
            return null;
        const company = await this.companiesRepository.findById(companyId);
        if (!company?.planId)
            return null;
        return this.resolvePlan(company.planId);
    }
    async resolvePlan(planRef) {
        const populatedPlan = planRef;
        if (populatedPlan?.features)
            return populatedPlan;
        const rawId = planRef;
        const planId = rawId?._id?.toString() ?? planRef.toString();
        return this.plansRepository.findById(planId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        employees_repository_1.EmployeesRepository,
        shifts_repository_1.ShiftsRepository,
        jwt_1.JwtService,
        config_1.ConfigService,
        audit_log_service_1.AuditLogService,
        companies_repository_1.CompaniesRepository,
        plans_repository_1.PlansRepository])
], AuthService);
//# sourceMappingURL=auth.service.js.map