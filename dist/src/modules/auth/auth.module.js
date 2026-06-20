"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const jwt_refresh_strategy_1 = require("./strategies/jwt-refresh.strategy");
const users_module_1 = require("../users/users.module");
const audit_log_module_1 = require("../audit-logs/audit-log.module");
const employees_module_1 = require("../employees/employees.module");
const shifts_module_1 = require("../shifts/shifts.module");
const companies_module_1 = require("../companies/companies.module");
const plans_module_1 = require("../plans/plans.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({}),
            users_module_1.UsersModule,
            audit_log_module_1.AuditLogModule,
            employees_module_1.EmployeesModule,
            shifts_module_1.ShiftsModule,
            companies_module_1.CompaniesModule,
            plans_module_1.PlansModule,
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, jwt_refresh_strategy_1.JwtRefreshStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map