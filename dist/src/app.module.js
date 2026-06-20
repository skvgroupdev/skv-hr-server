"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const core_2 = require("@nestjs/core");
const configuration_1 = __importDefault(require("./config/configuration"));
const database_module_1 = require("./database/database.module");
const seed_module_1 = require("./database/seed.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const companies_module_1 = require("./modules/companies/companies.module");
const audit_log_module_1 = require("./modules/audit-logs/audit-log.module");
const branches_module_1 = require("./modules/branches/branches.module");
const departments_module_1 = require("./modules/departments/departments.module");
const positions_module_1 = require("./modules/positions/positions.module");
const employees_module_1 = require("./modules/employees/employees.module");
const documents_module_1 = require("./modules/documents/documents.module");
const shifts_module_1 = require("./modules/shifts/shifts.module");
const holidays_module_1 = require("./modules/holidays/holidays.module");
const devices_module_1 = require("./modules/devices/devices.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const outside_work_module_1 = require("./modules/outside-work/outside-work.module");
const leave_module_1 = require("./modules/leave/leave.module");
const ot_module_1 = require("./modules/ot/ot.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const announcements_module_1 = require("./modules/announcements/announcements.module");
const reports_module_1 = require("./modules/reports/reports.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const tax_configs_module_1 = require("./modules/tax-configs/tax-configs.module");
const plans_module_1 = require("./modules/plans/plans.module");
const payroll_module_1 = require("./modules/payroll/payroll.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const jwt_auth_guard_1 = require("./modules/auth/guards/jwt-auth.guard");
const subscription_guard_1 = require("./common/guards/subscription.guard");
const company_policies_module_1 = require("./modules/company-policies/company-policies.module");
const attendance_adjustments_module_1 = require("./modules/attendance-adjustments/attendance-adjustments.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 1000,
                    limit: 10,
                },
            ]),
            database_module_1.DatabaseModule,
            seed_module_1.SeedModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            companies_module_1.CompaniesModule,
            audit_log_module_1.AuditLogModule,
            branches_module_1.BranchesModule,
            departments_module_1.DepartmentsModule,
            positions_module_1.PositionsModule,
            employees_module_1.EmployeesModule,
            documents_module_1.DocumentsModule,
            shifts_module_1.ShiftsModule,
            holidays_module_1.HolidaysModule,
            devices_module_1.DevicesModule,
            attendance_module_1.AttendanceModule,
            outside_work_module_1.OutsideWorkModule,
            leave_module_1.LeaveModule,
            ot_module_1.OTModule,
            notifications_module_1.NotificationsModule,
            announcements_module_1.AnnouncementsModule,
            reports_module_1.ReportsModule,
            tax_configs_module_1.TaxConfigsModule,
            plans_module_1.PlansModule,
            payroll_module_1.PayrollModule,
            company_policies_module_1.CompanyPoliciesModule,
            attendance_adjustments_module_1.AttendanceAdjustmentsModule,
            dashboard_module_1.DashboardModule,
            uploads_module_1.UploadsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useFactory: (reflector) => new jwt_auth_guard_1.JwtAuthGuard(reflector),
                inject: [core_2.Reflector],
            },
            {
                provide: core_1.APP_GUARD,
                useClass: subscription_guard_1.SubscriptionGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map