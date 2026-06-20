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
exports.TaxConfigsController = void 0;
const common_1 = require("@nestjs/common");
const tax_configs_service_1 = require("./tax-configs.service");
const create_tax_config_dto_1 = require("./dto/create-tax-config.dto");
const upsert_company_tax_config_dto_1 = require("./dto/upsert-company-tax-config.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let TaxConfigsController = class TaxConfigsController {
    taxConfigsService;
    constructor(taxConfigsService) {
        this.taxConfigsService = taxConfigsService;
    }
    async create(dto) {
        const config = await this.taxConfigsService.create(dto);
        return { data: config };
    }
    async findAll() {
        const configs = await this.taxConfigsService.findAll();
        return { data: configs };
    }
    async findCurrent() {
        const config = await this.taxConfigsService.findCurrent();
        return { data: config };
    }
    async update(id, dto) {
        const config = await this.taxConfigsService.update(id, dto);
        return { data: config };
    }
    async getCompanyConfig(user) {
        const tenantId = user.companyId;
        const config = await this.taxConfigsService.getCompanyConfig(tenantId);
        return { data: config };
    }
    async upsertCompanyConfig(user, dto) {
        const tenantId = user.companyId;
        const config = await this.taxConfigsService.upsertCompanyConfig(tenantId, dto, user.sub);
        return { data: config };
    }
    async getAllCompanyConfigs() {
        const configs = await this.taxConfigsService.getAllCompanyConfigs();
        return { data: configs };
    }
    async upsertCompanyConfigByAdmin(tenantId, dto, user) {
        const config = await this.taxConfigsService.upsertCompanyConfig(tenantId, dto, user.sub);
        return { data: config };
    }
};
exports.TaxConfigsController = TaxConfigsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tax_config_dto_1.CreateTaxConfigDto]),
    __metadata("design:returntype", Promise)
], TaxConfigsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'COMPANY_OWNER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaxConfigsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('current'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaxConfigsController.prototype, "findCurrent", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TaxConfigsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('company'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'SUPER_ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaxConfigsController.prototype, "getCompanyConfig", null);
__decorate([
    (0, common_1.Put)('company'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'SUPER_ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upsert_company_tax_config_dto_1.UpsertCompanyTaxConfigDto]),
    __metadata("design:returntype", Promise)
], TaxConfigsController.prototype, "upsertCompanyConfig", null);
__decorate([
    (0, common_1.Get)('companies'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaxConfigsController.prototype, "getAllCompanyConfigs", null);
__decorate([
    (0, common_1.Put)('companies/:tenantId'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upsert_company_tax_config_dto_1.UpsertCompanyTaxConfigDto, Object]),
    __metadata("design:returntype", Promise)
], TaxConfigsController.prototype, "upsertCompanyConfigByAdmin", null);
exports.TaxConfigsController = TaxConfigsController = __decorate([
    (0, common_1.Controller)('tax-configs'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [tax_configs_service_1.TaxConfigsService])
], TaxConfigsController);
//# sourceMappingURL=tax-configs.controller.js.map