"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceAdjustmentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const attendance_adjustment_schema_1 = require("./schemas/attendance-adjustment.schema");
const attendance_adjustments_repository_1 = require("./attendance-adjustments.repository");
const attendance_adjustments_service_1 = require("./attendance-adjustments.service");
const attendance_adjustments_controller_1 = require("./attendance-adjustments.controller");
const attendance_module_1 = require("../attendance/attendance.module");
const employees_module_1 = require("../employees/employees.module");
const audit_log_module_1 = require("../audit-logs/audit-log.module");
let AttendanceAdjustmentsModule = class AttendanceAdjustmentsModule {
};
exports.AttendanceAdjustmentsModule = AttendanceAdjustmentsModule;
exports.AttendanceAdjustmentsModule = AttendanceAdjustmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: attendance_adjustment_schema_1.AttendanceAdjustment.name, schema: attendance_adjustment_schema_1.AttendanceAdjustmentSchema },
            ]),
            attendance_module_1.AttendanceModule,
            employees_module_1.EmployeesModule,
            audit_log_module_1.AuditLogModule,
        ],
        providers: [attendance_adjustments_repository_1.AttendanceAdjustmentsRepository, attendance_adjustments_service_1.AttendanceAdjustmentsService],
        controllers: [attendance_adjustments_controller_1.AttendanceAdjustmentsController],
        exports: [attendance_adjustments_repository_1.AttendanceAdjustmentsRepository],
    })
], AttendanceAdjustmentsModule);
//# sourceMappingURL=attendance-adjustments.module.js.map