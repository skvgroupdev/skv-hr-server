"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const employee_schema_1 = require("./schemas/employee.schema");
const employees_repository_1 = require("./employees.repository");
const employees_service_1 = require("./employees.service");
const employees_controller_1 = require("./employees.controller");
const users_module_1 = require("../users/users.module");
const audit_log_module_1 = require("../audit-logs/audit-log.module");
const documents_module_1 = require("../documents/documents.module");
const companies_module_1 = require("../companies/companies.module");
const plans_module_1 = require("../plans/plans.module");
let EmployeesModule = class EmployeesModule {
};
exports.EmployeesModule = EmployeesModule;
exports.EmployeesModule = EmployeesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: employee_schema_1.Employee.name, schema: employee_schema_1.EmployeeSchema }]),
            users_module_1.UsersModule,
            audit_log_module_1.AuditLogModule,
            documents_module_1.DocumentsModule,
            companies_module_1.CompaniesModule,
            plans_module_1.PlansModule,
        ],
        providers: [employees_repository_1.EmployeesRepository, employees_service_1.EmployeesService],
        controllers: [employees_controller_1.EmployeesController],
        exports: [employees_repository_1.EmployeesRepository],
    })
], EmployeesModule);
//# sourceMappingURL=employees.module.js.map