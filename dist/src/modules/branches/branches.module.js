"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const branch_schema_1 = require("./schemas/branch.schema");
const branches_repository_1 = require("./branches.repository");
const branches_service_1 = require("./branches.service");
const branches_controller_1 = require("./branches.controller");
const audit_log_module_1 = require("../audit-logs/audit-log.module");
const employees_module_1 = require("../employees/employees.module");
const users_module_1 = require("../users/users.module");
const companies_module_1 = require("../companies/companies.module");
const plans_module_1 = require("../plans/plans.module");
let BranchesModule = class BranchesModule {
};
exports.BranchesModule = BranchesModule;
exports.BranchesModule = BranchesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: branch_schema_1.Branch.name, schema: branch_schema_1.BranchSchema }]),
            audit_log_module_1.AuditLogModule,
            employees_module_1.EmployeesModule,
            users_module_1.UsersModule,
            companies_module_1.CompaniesModule,
            plans_module_1.PlansModule,
        ],
        providers: [branches_repository_1.BranchesRepository, branches_service_1.BranchesService],
        controllers: [branches_controller_1.BranchesController],
        exports: [branches_repository_1.BranchesRepository],
    })
], BranchesModule);
//# sourceMappingURL=branches.module.js.map