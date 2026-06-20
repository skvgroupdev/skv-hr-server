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
exports.PositionsController = void 0;
const common_1 = require("@nestjs/common");
const positions_service_1 = require("./positions.service");
const create_position_dto_1 = require("./dto/create-position.dto");
const update_position_dto_1 = require("./dto/update-position.dto");
const position_query_dto_1 = require("./dto/position-query.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let PositionsController = class PositionsController {
    positionsService;
    constructor(positionsService) {
        this.positionsService = positionsService;
    }
    async create(dto, user) {
        const position = await this.positionsService.create(user.companyId, dto, user.sub, user.role);
        return { data: position };
    }
    async list(query, user) {
        return this.positionsService.list(user.companyId, query);
    }
    async getOne(id, user) {
        const position = await this.positionsService.getOne(user.companyId, id);
        return { data: position };
    }
    async update(id, dto, user) {
        const position = await this.positionsService.update(user.companyId, id, dto, user.sub, user.role);
        return { data: position };
    }
    async softDelete(id, user) {
        const position = await this.positionsService.softDelete(user.companyId, id, user.sub, user.role);
        return { data: position };
    }
};
exports.PositionsController = PositionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_position_dto_1.CreatePositionDto, Object]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [position_query_dto_1.PositionQueryDto, Object]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_position_dto_1.UpdatePositionDto, Object]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "softDelete", null);
exports.PositionsController = PositionsController = __decorate([
    (0, common_1.Controller)('positions'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [positions_service_1.PositionsService])
], PositionsController);
//# sourceMappingURL=positions.controller.js.map