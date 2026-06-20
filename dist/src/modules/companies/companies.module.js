"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const company_schema_1 = require("./schemas/company.schema");
const companies_repository_1 = require("./companies.repository");
const companies_service_1 = require("./companies.service");
const companies_controller_1 = require("./companies.controller");
const users_module_1 = require("../users/users.module");
const audit_log_module_1 = require("../audit-logs/audit-log.module");
const plans_module_1 = require("../plans/plans.module");
const branch_schema_1 = require("../branches/schemas/branch.schema");
const employee_schema_1 = require("../employees/schemas/employee.schema");
let CompaniesModule = class CompaniesModule {
};
exports.CompaniesModule = CompaniesModule;
exports.CompaniesModule = CompaniesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: company_schema_1.Company.name, schema: company_schema_1.CompanySchema },
                { name: branch_schema_1.Branch.name, schema: branch_schema_1.BranchSchema },
                { name: employee_schema_1.Employee.name, schema: employee_schema_1.EmployeeSchema },
            ]),
            users_module_1.UsersModule,
            audit_log_module_1.AuditLogModule,
            plans_module_1.PlansModule,
        ],
        providers: [companies_repository_1.CompaniesRepository, companies_service_1.CompaniesService],
        controllers: [companies_controller_1.CompaniesController],
        exports: [companies_repository_1.CompaniesRepository],
    })
], CompaniesModule);
//# sourceMappingURL=companies.module.js.map