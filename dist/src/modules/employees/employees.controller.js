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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const employees_service_1 = require("./employees.service");
const create_employee_dto_1 = require("./dto/create-employee.dto");
const update_employee_dto_1 = require("./dto/update-employee.dto");
const update_my_profile_dto_1 = require("./dto/update-my-profile.dto");
const employee_query_dto_1 = require("./dto/employee-query.dto");
const upload_document_dto_1 = require("./dto/upload-document.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
class ChangeRoleDto {
    role;
}
__decorate([
    (0, class_validator_1.IsEnum)(['HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR', 'STAFF']),
    __metadata("design:type", String)
], ChangeRoleDto.prototype, "role", void 0);
let EmployeesController = class EmployeesController {
    employeesService;
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    async create(dto, user) {
        const employee = await this.employeesService.create(user, dto);
        return { data: employee };
    }
    async list(query, user) {
        return this.employeesService.list(user, query);
    }
    async getOne(id, user) {
        const employee = await this.employeesService.getOne(user, id);
        return { data: employee };
    }
    async updateMyProfile(dto, user) {
        const employee = await this.employeesService.updateMyProfile(user, dto);
        return { data: employee };
    }
    async update(id, dto, user) {
        const employee = await this.employeesService.update(user, id, dto);
        return { data: employee };
    }
    changeRole(user, id, dto) {
        return this.employeesService.changeRole(user, id, dto.role);
    }
    async deactivate(id, user) {
        const employee = await this.employeesService.deactivate(user, id);
        return { data: employee };
    }
    async reactivate(id, user) {
        const employee = await this.employeesService.reactivate(user, id);
        return { data: employee };
    }
    async uploadDocument(id, dto, user) {
        const document = await this.employeesService.uploadDocument(user, id, dto);
        return { data: document };
    }
    async getDocuments(id, user) {
        const documents = await this.employeesService.getDocuments(user, id);
        return { data: documents };
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employee_dto_1.CreateEmployeeDto, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_query_dto_1.EmployeeQueryDto, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR', 'STAFF'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_my_profile_dto_1.UpdateMyProfileDto, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_employee_dto_1.UpdateEmployeeDto, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/role'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ChangeRoleDto]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "changeRole", null);
__decorate([
    (0, common_1.Post)(':id/deactivate'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(':id/reactivate'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Post)(':id/upload-document'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upload_document_dto_1.UploadDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)(':id/documents'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'STAFF'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "getDocuments", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, common_1.Controller)('employees'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map