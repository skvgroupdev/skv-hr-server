"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const employee_schema_1 = require("../employees/schemas/employee.schema");
const branch_schema_1 = require("../branches/schemas/branch.schema");
const attendance_module_1 = require("../attendance/attendance.module");
const leave_module_1 = require("../leave/leave.module");
const ot_module_1 = require("../ot/ot.module");
const outside_work_module_1 = require("../outside-work/outside-work.module");
const attendance_adjustments_module_1 = require("../attendance-adjustments/attendance-adjustments.module");
const dashboard_repository_1 = require("./dashboard.repository");
const dashboard_service_1 = require("./dashboard.service");
const dashboard_controller_1 = require("./dashboard.controller");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: employee_schema_1.Employee.name, schema: employee_schema_1.EmployeeSchema },
                { name: branch_schema_1.Branch.name, schema: branch_schema_1.BranchSchema },
            ]),
            attendance_module_1.AttendanceModule,
            leave_module_1.LeaveModule,
            ot_module_1.OTModule,
            outside_work_module_1.OutsideWorkModule,
            attendance_adjustments_module_1.AttendanceAdjustmentsModule,
        ],
        providers: [dashboard_repository_1.DashboardRepository, dashboard_service_1.DashboardService],
        controllers: [dashboard_controller_1.DashboardController],
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map