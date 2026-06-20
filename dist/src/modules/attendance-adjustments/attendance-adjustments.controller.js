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
exports.AttendanceAdjustmentsController = void 0;
const common_1 = require("@nestjs/common");
const attendance_adjustments_service_1 = require("./attendance-adjustments.service");
const create_attendance_adjustment_dto_1 = require("./dto/create-attendance-adjustment.dto");
const review_attendance_adjustment_dto_1 = require("./dto/review-attendance-adjustment.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const require_features_decorator_1 = require("../../common/decorators/require-features.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let AttendanceAdjustmentsController = class AttendanceAdjustmentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(dto, user) {
        return { data: await this.service.create(user, dto) };
    }
    async mine(user) {
        return { data: await this.service.getMine(user) };
    }
    async list(user, status) {
        return { data: await this.service.listForReviewer(user, status) };
    }
    async cancel(id, user) {
        return { data: await this.service.cancel(user, id) };
    }
    async approve(id, dto, user) {
        return { data: await this.service.approve(user, id, dto.comment) };
    }
    async reject(id, dto, user) {
        return { data: await this.service.reject(user, id, dto.reason) };
    }
};
exports.AttendanceAdjustmentsController = AttendanceAdjustmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('STAFF', 'SUPERVISOR', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_adjustment_dto_1.CreateAttendanceAdjustmentDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceAdjustmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceAdjustmentsController.prototype, "mine", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('HR_ADMIN', 'COMPANY_OWNER', 'BRANCH_MANAGER'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AttendanceAdjustmentsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttendanceAdjustmentsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_attendance_adjustment_dto_1.ReviewAttendanceAdjustmentDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceAdjustmentsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_attendance_adjustment_dto_1.RejectAttendanceAdjustmentDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceAdjustmentsController.prototype, "reject", null);
exports.AttendanceAdjustmentsController = AttendanceAdjustmentsController = __decorate([
    (0, common_1.Controller)('attendance-adjustments'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, require_features_decorator_1.RequireFeatures)('attendanceAdjustment'),
    __metadata("design:paramtypes", [attendance_adjustments_service_1.AttendanceAdjustmentsService])
], AttendanceAdjustmentsController);
//# sourceMappingURL=attendance-adjustments.controller.js.map