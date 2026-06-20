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
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const devices_service_1 = require("./devices.service");
const register_token_dto_1 = require("./dto/register-token.dto");
const remove_token_dto_1 = require("./dto/remove-token.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let DevicesController = class DevicesController {
    devicesService;
    constructor(devicesService) {
        this.devicesService = devicesService;
    }
    async registerToken(dto, user) {
        const token = await this.devicesService.registerToken(user.companyId, user.sub, dto);
        return { data: token };
    }
    async removeToken(dto) {
        return this.devicesService.removeToken(dto);
    }
};
exports.DevicesController = DevicesController;
__decorate([
    (0, common_1.Post)('register-token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_token_dto_1.RegisterTokenDto, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "registerToken", null);
__decorate([
    (0, common_1.Post)('remove-token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [remove_token_dto_1.RemoveTokenDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "removeToken", null);
exports.DevicesController = DevicesController = __decorate([
    (0, common_1.Controller)('devices'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
//# sourceMappingURL=devices.controller.js.map