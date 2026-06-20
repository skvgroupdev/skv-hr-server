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
exports.ShiftsController = void 0;
const common_1 = require("@nestjs/common");
const shifts_service_1 = require("./shifts.service");
const create_shift_dto_1 = require("./dto/create-shift.dto");
const update_shift_dto_1 = require("./dto/update-shift.dto");
const assign_shift_dto_1 = require("./dto/assign-shift.dto");
const bulk_assign_shift_dto_1 = require("./dto/bulk-assign-shift.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const require_features_decorator_1 = require("../../common/decorators/require-features.decorator");
let ShiftsController = class ShiftsController {
    shiftsService;
    constructor(shiftsService) {
        this.shiftsService = shiftsService;
    }
    async create(dto, user) {
        const shift = await this.shiftsService.create(user.companyId, dto);
        return { data: shift };
    }
    async findAll(user) {
        const shifts = await this.shiftsService.findAll(user.companyId);
        return { data: shifts };
    }
    async findOne(id, user) {
        const shift = await this.shiftsService.findOne(user.companyId, id);
        return { data: shift };
    }
    async update(id, dto, user) {
        const shift = await this.shiftsService.update(user.companyId, id, dto);
        return { data: shift };
    }
    async softDelete(id, user) {
        const shift = await this.shiftsService.softDelete(user.companyId, id);
        return { data: shift };
    }
    async assign(id, dto, user) {
        const assignment = await this.shiftsService.assignToEmployee(user.companyId, id, dto);
        return { data: assignment };
    }
    async getEmployeeShift(id, user) {
        const assignment = await this.shiftsService.getEmployeeShift(user, id);
        return { data: assignment };
    }
    async getEmployeeShiftHistory(id, user) {
        const history = await this.shiftsService.getEmployeeShiftHistory(user, id);
        return { data: history };
    }
    async bulkAssign(dto, user) {
        const result = await this.shiftsService.bulkAssignShift(user, dto);
        return { data: result };
    }
};
exports.ShiftsController = ShiftsController;
__decorate([
    (0, common_1.Post)('shifts'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_shift_dto_1.CreateShiftDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('shifts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('shifts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('shifts/:id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_shift_dto_1.UpdateShiftDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('shifts/:id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Post)('shifts/:id/assign'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_shift_dto_1.AssignShiftDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "assign", null);
__decorate([
    (0, common_1.Get)('employees/:id/shift'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "getEmployeeShift", null);
__decorate([
    (0, common_1.Get)('employees/:id/shift/history'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "getEmployeeShiftHistory", null);
__decorate([
    (0, common_1.Post)('shifts/bulk-assign'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_assign_shift_dto_1.BulkAssignShiftDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "bulkAssign", null);
exports.ShiftsController = ShiftsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, require_features_decorator_1.RequireFeatures)('shiftManagement'),
    __metadata("design:paramtypes", [shifts_service_1.ShiftsService])
], ShiftsController);
//# sourceMappingURL=shifts.controller.js.map