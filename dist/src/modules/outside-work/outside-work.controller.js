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
exports.OutsideWorkController = void 0;
const common_1 = require("@nestjs/common");
const outside_work_service_1 = require("./outside-work.service");
const create_outside_work_dto_1 = require("./dto/create-outside-work.dto");
const approve_outside_work_dto_1 = require("./dto/approve-outside-work.dto");
const outside_work_query_dto_1 = require("./dto/outside-work-query.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const require_features_decorator_1 = require("../../common/decorators/require-features.decorator");
let OutsideWorkController = class OutsideWorkController {
    outsideWorkService;
    constructor(outsideWorkService) {
        this.outsideWorkService = outsideWorkService;
    }
    async request(dto, user) {
        const item = await this.outsideWorkService.request(user.companyId, user.sub, dto);
        return { data: item };
    }
    async getMy(query, user) {
        return this.outsideWorkService.getMy(user.companyId, user.sub, query);
    }
    async getPending(user) {
        const items = await this.outsideWorkService.getPending(user.companyId);
        return { data: items };
    }
    async getReport(query, user) {
        return this.outsideWorkService.getReport(user.companyId, query);
    }
    async getOne(id, user) {
        const item = await this.outsideWorkService.getOne(user.companyId, id);
        return { data: item };
    }
    async approve(id, dto, user) {
        const item = await this.outsideWorkService.approve(user.companyId, id, user.sub, dto);
        return { data: item };
    }
    async reject(id, dto, user) {
        const item = await this.outsideWorkService.reject(user.companyId, id, user.sub, dto);
        return { data: item };
    }
};
exports.OutsideWorkController = OutsideWorkController;
__decorate([
    (0, common_1.Post)('request'),
    (0, roles_decorator_1.Roles)('STAFF', 'SUPERVISOR', 'BRANCH_MANAGER', 'HR_ADMIN', 'COMPANY_OWNER'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_outside_work_dto_1.CreateOutsideWorkDto, Object]),
    __metadata("design:returntype", Promise)
], OutsideWorkController.prototype, "request", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [outside_work_query_dto_1.OutsideWorkQueryDto, Object]),
    __metadata("design:returntype", Promise)
], OutsideWorkController.prototype, "getMy", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OutsideWorkController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('report'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [outside_work_query_dto_1.OutsideWorkQueryDto, Object]),
    __metadata("design:returntype", Promise)
], OutsideWorkController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OutsideWorkController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_outside_work_dto_1.ApproveOutsideWorkDto, Object]),
    __metadata("design:returntype", Promise)
], OutsideWorkController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_outside_work_dto_1.RejectOutsideWorkDto, Object]),
    __metadata("design:returntype", Promise)
], OutsideWorkController.prototype, "reject", null);
exports.OutsideWorkController = OutsideWorkController = __decorate([
    (0, common_1.Controller)('outside-work'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, require_features_decorator_1.RequireFeatures)('outsideWork'),
    __metadata("design:paramtypes", [outside_work_service_1.OutsideWorkService])
], OutsideWorkController);
//# sourceMappingURL=outside-work.controller.js.map