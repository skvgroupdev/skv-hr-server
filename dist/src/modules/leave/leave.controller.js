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
exports.LeaveController = void 0;
const common_1 = require("@nestjs/common");
const leave_service_1 = require("./leave.service");
const create_leave_type_dto_1 = require("./dto/create-leave-type.dto");
const create_leave_request_dto_1 = require("./dto/create-leave-request.dto");
const approve_leave_dto_1 = require("./dto/approve-leave.dto");
const leave_balance_adjust_dto_1 = require("./dto/leave-balance-adjust.dto");
const leave_query_dto_1 = require("./dto/leave-query.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const require_features_decorator_1 = require("../../common/decorators/require-features.decorator");
let LeaveController = class LeaveController {
    leaveService;
    constructor(leaveService) {
        this.leaveService = leaveService;
    }
    async createLeaveType(dto, user) {
        const leaveType = await this.leaveService.createLeaveType(user.companyId, dto);
        return { data: leaveType };
    }
    async findAllLeaveTypes(user) {
        const types = await this.leaveService.findAllLeaveTypes(user.companyId);
        return { data: types };
    }
    async updateLeaveType(id, dto, user) {
        const leaveType = await this.leaveService.updateLeaveType(user.companyId, id, dto);
        return { data: leaveType };
    }
    async deleteLeaveType(id, user) {
        const leaveType = await this.leaveService.deleteLeaveType(user.companyId, id);
        return { data: leaveType };
    }
    async request(dto, user) {
        const leave = await this.leaveService.request(user.companyId, user.sub, dto);
        return { data: leave };
    }
    async getMy(query, user) {
        return this.leaveService.getMy(user.companyId, user.sub, query);
    }
    async getPending(user) {
        const items = await this.leaveService.getPending(user.companyId);
        return { data: items };
    }
    async getReport(query, user) {
        return this.leaveService.getReport(user.companyId, query);
    }
    async getMyBalance(user) {
        const balances = await this.leaveService.getMyBalance(user.companyId, user.sub);
        return { data: balances };
    }
    async getEmployeeBalance(employeeId, user) {
        const balances = await this.leaveService.getEmployeeBalance(user.companyId, employeeId);
        return { data: balances };
    }
    async adjustBalance(employeeId, dto, user) {
        const balance = await this.leaveService.adjustBalance(user.companyId, employeeId, dto);
        return { data: balance };
    }
    async getOne(id, user) {
        const leave = await this.leaveService.getOne(user.companyId, id);
        return { data: leave };
    }
    async approve(id, dto, user) {
        const leave = await this.leaveService.approve(user.companyId, id, user.sub, user.role, dto);
        return { data: leave };
    }
    async reject(id, dto, user) {
        const leave = await this.leaveService.reject(user.companyId, id, user.sub, user.role, dto);
        return { data: leave };
    }
    async cancel(id, user) {
        const leave = await this.leaveService.cancel(user.companyId, id, user.sub);
        return { data: leave };
    }
};
exports.LeaveController = LeaveController;
__decorate([
    (0, common_1.Post)('leave-types'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_type_dto_1.CreateLeaveTypeDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "createLeaveType", null);
__decorate([
    (0, common_1.Get)('leave-types'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "findAllLeaveTypes", null);
__decorate([
    (0, common_1.Patch)('leave-types/:id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "updateLeaveType", null);
__decorate([
    (0, common_1.Delete)('leave-types/:id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "deleteLeaveType", null);
__decorate([
    (0, common_1.Post)('leave/request'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_request_dto_1.CreateLeaveRequestDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "request", null);
__decorate([
    (0, common_1.Get)('leave/my'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_query_dto_1.LeaveQueryDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getMy", null);
__decorate([
    (0, common_1.Get)('leave/pending'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('leave/report'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_query_dto_1.LeaveQueryDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)('leave/balance/my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getMyBalance", null);
__decorate([
    (0, common_1.Get)('leave/balance/:employeeId'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getEmployeeBalance", null);
__decorate([
    (0, common_1.Patch)('leave/balance/:employeeId'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, leave_balance_adjust_dto_1.LeaveBalanceAdjustDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "adjustBalance", null);
__decorate([
    (0, common_1.Get)('leave/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)('leave/:id/approve'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_leave_dto_1.ApproveLeaveDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)('leave/:id/reject'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_leave_dto_1.RejectLeaveDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)('leave/:id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "cancel", null);
exports.LeaveController = LeaveController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, require_features_decorator_1.RequireFeatures)('leave'),
    __metadata("design:paramtypes", [leave_service_1.LeaveService])
], LeaveController);
//# sourceMappingURL=leave.controller.js.map