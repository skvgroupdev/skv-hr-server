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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const payroll_service_1 = require("./payroll.service");
const create_payroll_period_dto_1 = require("./dto/create-payroll-period.dto");
const query_payslips_dto_1 = require("./dto/query-payslips.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const require_features_decorator_1 = require("../../common/decorators/require-features.decorator");
const update_payslip_adjustments_dto_1 = require("./dto/update-payslip-adjustments.dto");
const update_payroll_policy_dto_1 = require("./dto/update-payroll-policy.dto");
let PayrollController = class PayrollController {
    payrollService;
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async createPeriod(dto, user) {
        const period = await this.payrollService.createPeriod(user.companyId, user.sub, dto);
        return { data: period };
    }
    async listPeriods(page, limit, user) {
        return this.payrollService.listPeriods(user.companyId, parseInt(page ?? '1', 10), parseInt(limit ?? '20', 10));
    }
    async getPeriod(id, user) {
        const period = await this.payrollService.getPeriod(user.companyId, id);
        return { data: period };
    }
    async generatePayroll(id, user) {
        const period = await this.payrollService.generatePayroll(user.companyId, id, user.sub);
        return { data: period };
    }
    async hrReviewPeriod(id, user) {
        const period = await this.payrollService.hrReviewPeriod(user.companyId, id, user.sub);
        return { data: period };
    }
    async payPeriod(id, user) {
        const period = await this.payrollService.payPeriod(user.companyId, id, user.sub);
        return { data: period };
    }
    async getPeriodPayslips(id, page, limit, user) {
        return this.payrollService.getPeriodPayslips(user.companyId, id, parseInt(page ?? '1', 10), parseInt(limit ?? '20', 10));
    }
    async getAllPayslips(query, user) {
        return this.payrollService.getAllPayslips(user.companyId, {
            page: query.page ? parseInt(query.page, 10) : 1,
            limit: query.limit ? parseInt(query.limit, 10) : 20,
            sort: query.sort ?? '-createdAt',
            periodId: query.periodId,
            status: query.status,
            search: query.search,
            startDate: query.startDate,
            endDate: query.endDate,
        });
    }
    async getPayslipById(id, user) {
        const data = await this.payrollService.getPayslipById(user.companyId, id);
        return { data };
    }
    async updatePayslipAdjustments(id, dto, user) {
        return {
            data: await this.payrollService.updatePayslipAdjustments(user.companyId, id, user.sub, dto),
        };
    }
    async getEmployeePayslips(employeeId, query, user) {
        return this.payrollService.getEmployeePayslips(user.companyId, employeeId, {
            page: query.page ? parseInt(query.page, 10) : 1,
            limit: query.limit ? parseInt(query.limit, 10) : 20,
        });
    }
    async getEmployeeFinanceSummary(employeeId, user) {
        const data = await this.payrollService.getEmployeeFinanceSummary(user.companyId, employeeId);
        return { data };
    }
    async getMyPayslips(page, limit, user) {
        return this.payrollService.getMyPayslips(user.companyId, user.sub, parseInt(page ?? '1', 10), parseInt(limit ?? '20', 10));
    }
    async getMyPayslip(id, user) {
        const payslip = await this.payrollService.getMyPayslip(user.companyId, user.sub, id);
        return { data: payslip };
    }
    async getReport(periodId, user) {
        const data = await this.payrollService.getReport(user.companyId, periodId);
        return { data };
    }
    async getPolicy(user) {
        const data = await this.payrollService.getPayrollPolicy(user.companyId);
        return { data };
    }
    async updatePolicy(dto, user) {
        const data = await this.payrollService.updatePayrollPolicy(user.companyId, user.sub, user.role, dto);
        return { data };
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Post)('periods'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payroll_period_dto_1.CreatePayrollPeriodDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "createPeriod", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "listPeriods", null);
__decorate([
    (0, common_1.Get)('periods/:id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getPeriod", null);
__decorate([
    (0, common_1.Post)('periods/:id/generate'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "generatePayroll", null);
__decorate([
    (0, common_1.Post)('periods/:id/hr-review'),
    (0, roles_decorator_1.Roles)('HR_ADMIN', 'COMPANY_OWNER'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "hrReviewPeriod", null);
__decorate([
    (0, common_1.Post)('periods/:id/pay'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "payPeriod", null);
__decorate([
    (0, common_1.Get)('periods/:id/payslips'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getPeriodPayslips", null);
__decorate([
    (0, common_1.Get)('payslips'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_payslips_dto_1.QueryPayslipsDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getAllPayslips", null);
__decorate([
    (0, common_1.Get)('payslips/:id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getPayslipById", null);
__decorate([
    (0, common_1.Patch)('payslips/:id/adjustments'),
    (0, roles_decorator_1.Roles)('HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payslip_adjustments_dto_1.UpdatePayslipAdjustmentsDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "updatePayslipAdjustments", null);
__decorate([
    (0, common_1.Get)('employees/:employeeId/payslips'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_payslips_dto_1.QueryEmployeePayslipsDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getEmployeePayslips", null);
__decorate([
    (0, common_1.Get)('employees/:employeeId/finance-summary'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getEmployeeFinanceSummary", null);
__decorate([
    (0, common_1.Get)('my-payslips'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getMyPayslips", null);
__decorate([
    (0, common_1.Get)('my-payslips/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getMyPayslip", null);
__decorate([
    (0, common_1.Get)('report'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Query)('periodId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)('policy'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getPolicy", null);
__decorate([
    (0, common_1.Patch)('policy'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_payroll_policy_dto_1.UpdatePayrollPolicyDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "updatePolicy", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.Controller)('payroll'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, require_features_decorator_1.RequireFeatures)('payroll'),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map