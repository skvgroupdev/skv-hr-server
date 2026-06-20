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
exports.OTController = void 0;
const common_1 = require("@nestjs/common");
const ot_service_1 = require("./ot.service");
const create_ot_request_dto_1 = require("./dto/create-ot-request.dto");
const update_ot_policy_dto_1 = require("./dto/update-ot-policy.dto");
const approve_ot_dto_1 = require("./dto/approve-ot.dto");
const ot_query_dto_1 = require("./dto/ot-query.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const require_features_decorator_1 = require("../../common/decorators/require-features.decorator");
let OTController = class OTController {
    otService;
    constructor(otService) {
        this.otService = otService;
    }
    async getPolicy(user) {
        const policy = await this.otService.getPolicy(user.companyId);
        return { data: policy };
    }
    async updatePolicy(dto, user) {
        const policy = await this.otService.updatePolicy(user.companyId, dto);
        return { data: policy };
    }
    async request(dto, user) {
        const ot = await this.otService.request(user.companyId, user.sub, dto);
        return { data: ot };
    }
    async getMy(query, user) {
        return this.otService.getMy(user.companyId, user.sub, query);
    }
    async getPending(user) {
        const items = await this.otService.getPending(user.companyId);
        return { data: items };
    }
    async getReport(query, user) {
        return this.otService.getReport(user.companyId, query);
    }
    async getOne(id, user) {
        const ot = await this.otService.getOne(user.companyId, id);
        return { data: ot };
    }
    async approve(id, dto, user) {
        const ot = await this.otService.approve(user.companyId, id, user.sub, user.role, dto);
        return { data: ot };
    }
    async reject(id, dto, user) {
        const ot = await this.otService.reject(user.companyId, id, user.sub, user.role, dto);
        return { data: ot };
    }
    async cancel(id, user) {
        const ot = await this.otService.cancel(user.companyId, id, user.sub);
        return { data: ot };
    }
};
exports.OTController = OTController;
__decorate([
    (0, common_1.Get)('policy'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getPolicy", null);
__decorate([
    (0, common_1.Patch)('policy'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_ot_policy_dto_1.UpdateOTPolicyDto, Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "updatePolicy", null);
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ot_request_dto_1.CreateOTRequestDto, Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "request", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ot_query_dto_1.OTQueryDto, Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getMy", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('report'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ot_query_dto_1.OTQueryDto, Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_ot_dto_1.ApproveOTDto, Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_ot_dto_1.RejectOTDto, Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "cancel", null);
exports.OTController = OTController = __decorate([
    (0, common_1.Controller)('ot'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, require_features_decorator_1.RequireFeatures)('ot'),
    __metadata("design:paramtypes", [ot_service_1.OTService])
], OTController);
//# sourceMappingURL=ot.controller.js.map