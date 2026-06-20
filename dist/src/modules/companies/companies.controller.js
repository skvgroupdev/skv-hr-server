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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesController = void 0;
const common_1 = require("@nestjs/common");
const companies_service_1 = require("./companies.service");
const create_company_dto_1 = require("./dto/create-company.dto");
const update_company_dto_1 = require("./dto/update-company.dto");
const create_owner_dto_1 = require("./dto/create-owner.dto");
const company_query_dto_1 = require("./dto/company-query.dto");
const assign_plan_dto_1 = require("./dto/assign-plan.dto");
const update_subscription_dto_1 = require("./dto/update-subscription.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let CompaniesController = class CompaniesController {
    companiesService;
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    async create(dto, user) {
        const company = await this.companiesService.createCompany(dto, user.sub, user.role);
        return { data: company };
    }
    async list(query) {
        return this.companiesService.listCompanies(query);
    }
    async getOne(id) {
        const company = await this.companiesService.getCompany(id);
        return { data: company };
    }
    async update(id, dto, user) {
        const company = await this.companiesService.updateCompany(id, dto, user.sub, user.role);
        return { data: company };
    }
    async activate(id, user) {
        const company = await this.companiesService.activateCompany(id, user.sub, user.role);
        return { data: company };
    }
    async suspend(id, user) {
        const company = await this.companiesService.suspendCompany(id, user.sub, user.role);
        return { data: company };
    }
    async createOwner(id, dto, user) {
        const owner = await this.companiesService.createOwner(id, dto, user.sub, user.role);
        return { data: owner };
    }
    async assignPlan(id, body, user) {
        const company = await this.companiesService.assignPlan(id, body.planId, body.startDate, body.endDate, body.isPaid ?? false, user.sub);
        return { data: company };
    }
    async updateSubscription(id, body, user) {
        const company = await this.companiesService.updateSubscription(id, body, user.sub);
        return { data: company };
    }
    async extendSubscription(id, body, user) {
        const company = await this.companiesService.extendSubscription(id, body, user.sub);
        return { data: company };
    }
    async getUsage(id) {
        const usage = await this.companiesService.getUsage(id);
        return { data: usage };
    }
    async getSuperDashboard() {
        const stats = await this.companiesService.getSuperDashboard();
        return { data: stats };
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_query_dto_1.CompanyQueryDto]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_company_dto_1.UpdateCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/suspend'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "suspend", null);
__decorate([
    (0, common_1.Post)(':id/create-owner'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_owner_dto_1.CreateOwnerDto, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "createOwner", null);
__decorate([
    (0, common_1.Post)(':id/assign-plan'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_plan_dto_1.AssignPlanDto, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "assignPlan", null);
__decorate([
    (0, common_1.Patch)(':id/subscription'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subscription_dto_1.UpdateSubscriptionDto, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Post)(':id/subscription/extend'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subscription_dto_1.ExtendSubscriptionDto, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "extendSubscription", null);
__decorate([
    (0, common_1.Get)(':id/usage'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "getUsage", null);
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "getSuperDashboard", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, common_1.Controller)('super/companies'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);
//# sourceMappingURL=companies.controller.js.map