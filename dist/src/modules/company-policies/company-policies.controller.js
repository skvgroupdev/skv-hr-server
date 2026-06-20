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
exports.CompanyPoliciesController = void 0;
const common_1 = require("@nestjs/common");
const company_policies_service_1 = require("./company-policies.service");
const update_attendance_policy_dto_1 = require("./dto/update-attendance-policy.dto");
const update_payroll_policy_dto_1 = require("./dto/update-payroll-policy.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const require_features_decorator_1 = require("../../common/decorators/require-features.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let CompanyPoliciesController = class CompanyPoliciesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async get(user) {
        return { data: await this.service.getEffectivePolicy(user.companyId) };
    }
    async updateAttendance(dto, user) {
        const data = await this.service.updateAttendancePolicy(user.companyId, user.sub, user.role, dto);
        return { data };
    }
    async updatePayroll(dto, user) {
        const data = await this.service.updatePayrollPolicy(user.companyId, user.sub, user.role, dto);
        return { data };
    }
};
exports.CompanyPoliciesController = CompanyPoliciesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanyPoliciesController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)('attendance'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, require_features_decorator_1.RequireFeatures)('attendance'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_attendance_policy_dto_1.UpdateAttendancePolicyDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyPoliciesController.prototype, "updateAttendance", null);
__decorate([
    (0, common_1.Patch)('payroll'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER'),
    (0, require_features_decorator_1.RequireFeatures)('payroll'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_payroll_policy_dto_1.UpdatePayrollPolicyDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyPoliciesController.prototype, "updatePayroll", null);
exports.CompanyPoliciesController = CompanyPoliciesController = __decorate([
    (0, common_1.Controller)('company-policy'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [company_policies_service_1.CompanyPoliciesService])
], CompanyPoliciesController);
//# sourceMappingURL=company-policies.controller.js.map