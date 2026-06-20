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
exports.HolidaysController = void 0;
const common_1 = require("@nestjs/common");
const holidays_service_1 = require("./holidays.service");
const create_holiday_dto_1 = require("./dto/create-holiday.dto");
const update_holiday_dto_1 = require("./dto/update-holiday.dto");
const holiday_query_dto_1 = require("./dto/holiday-query.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let HolidaysController = class HolidaysController {
    holidaysService;
    constructor(holidaysService) {
        this.holidaysService = holidaysService;
    }
    async create(dto, user) {
        const holiday = await this.holidaysService.create(user.companyId, dto);
        return { data: holiday };
    }
    async findAll(query, user) {
        return this.holidaysService.findAll(user.companyId, query);
    }
    async findOne(id, user) {
        const holiday = await this.holidaysService.findOne(user.companyId, id);
        return { data: holiday };
    }
    async update(id, dto, user) {
        const holiday = await this.holidaysService.update(user.companyId, id, dto);
        return { data: holiday };
    }
    async softDelete(id, user) {
        const holiday = await this.holidaysService.softDelete(user.companyId, id);
        return { data: holiday };
    }
};
exports.HolidaysController = HolidaysController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_holiday_dto_1.CreateHolidayDto, Object]),
    __metadata("design:returntype", Promise)
], HolidaysController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [holiday_query_dto_1.HolidayQueryDto, Object]),
    __metadata("design:returntype", Promise)
], HolidaysController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HolidaysController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_holiday_dto_1.UpdateHolidayDto, Object]),
    __metadata("design:returntype", Promise)
], HolidaysController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HolidaysController.prototype, "softDelete", null);
exports.HolidaysController = HolidaysController = __decorate([
    (0, common_1.Controller)('holidays'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [holidays_service_1.HolidaysService])
], HolidaysController);
//# sourceMappingURL=holidays.controller.js.map