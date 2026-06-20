"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const attendance_log_schema_1 = require("./schemas/attendance-log.schema");
const attendance_repository_1 = require("./attendance.repository");
const attendance_service_1 = require("./attendance.service");
const attendance_controller_1 = require("./attendance.controller");
const geofence_service_1 = require("./geofence.service");
const audit_log_module_1 = require("../audit-logs/audit-log.module");
const employees_module_1 = require("../employees/employees.module");
const branches_module_1 = require("../branches/branches.module");
const shifts_module_1 = require("../shifts/shifts.module");
const notifications_module_1 = require("../notifications/notifications.module");
const company_policies_module_1 = require("../company-policies/company-policies.module");
let AttendanceModule = class AttendanceModule {
};
exports.AttendanceModule = AttendanceModule;
exports.AttendanceModule = AttendanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: attendance_log_schema_1.AttendanceLog.name, schema: attendance_log_schema_1.AttendanceLogSchema },
            ]),
            audit_log_module_1.AuditLogModule,
            employees_module_1.EmployeesModule,
            branches_module_1.BranchesModule,
            shifts_module_1.ShiftsModule,
            notifications_module_1.NotificationsModule,
            company_policies_module_1.CompanyPoliciesModule,
        ],
        providers: [attendance_repository_1.AttendanceRepository, attendance_service_1.AttendanceService, geofence_service_1.GeofenceService],
        controllers: [attendance_controller_1.AttendanceController],
        exports: [attendance_repository_1.AttendanceRepository, attendance_service_1.AttendanceService],
    })
], AttendanceModule);
//# sourceMappingURL=attendance.module.js.map