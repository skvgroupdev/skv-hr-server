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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const report_query_dto_1 = require("./report-query.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getDailyAttendance(query, user) {
        const data = await this.reportsService.getDailyAttendance(user.companyId, query);
        return { data };
    }
    async getMonthlyAttendance(query, user) {
        const data = await this.reportsService.getMonthlyAttendance(user.companyId, query);
        return { data };
    }
    async getLateAttendance(query, user) {
        const data = await this.reportsService.getLateAttendance(user.companyId, query);
        return { data };
    }
    async getAbsentAttendance(query, user) {
        const data = await this.reportsService.getAbsentAttendance(user.companyId, query);
        return { data };
    }
    async getMissingCheckout(query, user) {
        const data = await this.reportsService.getMissingCheckout(user.companyId, query);
        return { data };
    }
    async getLeaveSummary(query, user) {
        const data = await this.reportsService.getLeaveSummary(user.companyId, query);
        return { data };
    }
    async getLeaveBalance(query, user) {
        const data = await this.reportsService.getLeaveBalance(user.companyId, query);
        return { data };
    }
    async getOTSummary(query, user) {
        const data = await this.reportsService.getOTSummary(user.companyId, query);
        return { data };
    }
    async getOTCost(query, user) {
        const data = await this.reportsService.getOTCost(user.companyId, query);
        return { data };
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('attendance/daily'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDailyAttendance", null);
__decorate([
    (0, common_1.Get)('attendance/monthly'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMonthlyAttendance", null);
__decorate([
    (0, common_1.Get)('attendance/late'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLateAttendance", null);
__decorate([
    (0, common_1.Get)('attendance/absent'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAbsentAttendance", null);
__decorate([
    (0, common_1.Get)('attendance/missing-checkout'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMissingCheckout", null);
__decorate([
    (0, common_1.Get)('leave/summary'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLeaveSummary", null);
__decorate([
    (0, common_1.Get)('leave/balance'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLeaveBalance", null);
__decorate([
    (0, common_1.Get)('ot/summary'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getOTSummary", null);
__decorate([
    (0, common_1.Get)('ot/cost'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getOTCost", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map