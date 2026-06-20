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
exports.BranchesController = void 0;
const common_1 = require("@nestjs/common");
const branches_service_1 = require("./branches.service");
const create_branch_dto_1 = require("./dto/create-branch.dto");
const update_branch_dto_1 = require("./dto/update-branch.dto");
const branch_query_dto_1 = require("./dto/branch-query.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let BranchesController = class BranchesController {
    branchesService;
    constructor(branchesService) {
        this.branchesService = branchesService;
    }
    async create(dto, user) {
        const branch = await this.branchesService.create(user.companyId, dto, user.sub, user.role);
        return { data: branch };
    }
    async list(query, user) {
        return this.branchesService.list(user.companyId, query);
    }
    async getOne(id, user) {
        const branch = await this.branchesService.getOne(user.companyId, id);
        return { data: branch };
    }
    async update(id, dto, user) {
        const branch = await this.branchesService.update(user.companyId, id, dto, user.sub, user.role);
        return { data: branch };
    }
    async softDelete(id, user) {
        const branch = await this.branchesService.softDelete(user.companyId, id, user.sub, user.role);
        return { data: branch };
    }
    async activate(id, user) {
        const branch = await this.branchesService.activate(user.companyId, id, user.sub, user.role);
        return { data: branch };
    }
    async deactivate(id, user) {
        const branch = await this.branchesService.deactivate(user.companyId, id, user.sub, user.role);
        return { data: branch };
    }
    async assignManager(id, body, user) {
        const branch = await this.branchesService.assignManager(user.companyId, id, body.employeeId, user.sub, user.role);
        return { data: branch };
    }
};
exports.BranchesController = BranchesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_branch_dto_1.CreateBranchDto, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [branch_query_dto_1.BranchQueryDto, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_branch_dto_1.UpdateBranchDto, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/deactivate'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(':id/manager'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "assignManager", null);
exports.BranchesController = BranchesController = __decorate([
    (0, common_1.Controller)('branches'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [branches_service_1.BranchesService])
], BranchesController);
//# sourceMappingURL=branches.controller.js.map