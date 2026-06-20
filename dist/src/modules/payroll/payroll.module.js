"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const payroll_period_schema_1 = require("./schemas/payroll-period.schema");
const payslip_schema_1 = require("./schemas/payslip.schema");
const payroll_repository_1 = require("./payroll.repository");
const payroll_service_1 = require("./payroll.service");
const payroll_controller_1 = require("./payroll.controller");
const company_policies_module_1 = require("../company-policies/company-policies.module");
const shifts_module_1 = require("../shifts/shifts.module");
const attendance_module_1 = require("../attendance/attendance.module");
const tax_configs_module_1 = require("../tax-configs/tax-configs.module");
const employees_module_1 = require("../employees/employees.module");
const ot_module_1 = require("../ot/ot.module");
const leave_module_1 = require("../leave/leave.module");
let PayrollModule = class PayrollModule {
};
exports.PayrollModule = PayrollModule;
exports.PayrollModule = PayrollModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: payroll_period_schema_1.PayrollPeriod.name, schema: payroll_period_schema_1.PayrollPeriodSchema },
                { name: payslip_schema_1.Payslip.name, schema: payslip_schema_1.PayslipSchema },
            ]),
            tax_configs_module_1.TaxConfigsModule,
            company_policies_module_1.CompanyPoliciesModule,
            shifts_module_1.ShiftsModule,
            attendance_module_1.AttendanceModule,
            employees_module_1.EmployeesModule,
            ot_module_1.OTModule,
            leave_module_1.LeaveModule,
        ],
        providers: [payroll_repository_1.PayrollRepository, payroll_service_1.PayrollService],
        controllers: [payroll_controller_1.PayrollController],
        exports: [payroll_repository_1.PayrollRepository],
    })
], PayrollModule);
//# sourceMappingURL=payroll.module.js.map