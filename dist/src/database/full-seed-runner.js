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
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const full_seed_service_1 = require("./full-seed.service");
const company_schema_1 = require("../modules/companies/schemas/company.schema");
const branch_schema_1 = require("../modules/branches/schemas/branch.schema");
const department_schema_1 = require("../modules/departments/schemas/department.schema");
const position_schema_1 = require("../modules/positions/schemas/position.schema");
const user_schema_1 = require("../modules/users/schemas/user.schema");
const employee_schema_1 = require("../modules/employees/schemas/employee.schema");
const shift_schema_1 = require("../modules/shifts/schemas/shift.schema");
const shift_assignment_schema_1 = require("../modules/shifts/schemas/shift-assignment.schema");
const holiday_schema_1 = require("../modules/holidays/schemas/holiday.schema");
const attendance_log_schema_1 = require("../modules/attendance/schemas/attendance-log.schema");
const leave_type_schema_1 = require("../modules/leave/schemas/leave-type.schema");
const leave_balance_schema_1 = require("../modules/leave/schemas/leave-balance.schema");
const leave_request_schema_1 = require("../modules/leave/schemas/leave-request.schema");
const ot_request_schema_1 = require("../modules/ot/schemas/ot-request.schema");
const configuration_1 = __importDefault(require("../config/configuration"));
let FullSeedAppModule = class FullSeedAppModule {
};
FullSeedAppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ load: [configuration_1.default], isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skv_hr'),
            mongoose_1.MongooseModule.forFeature([
                { name: company_schema_1.Company.name, schema: company_schema_1.CompanySchema },
                { name: branch_schema_1.Branch.name, schema: branch_schema_1.BranchSchema },
                { name: department_schema_1.Department.name, schema: department_schema_1.DepartmentSchema },
                { name: position_schema_1.Position.name, schema: position_schema_1.PositionSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: employee_schema_1.Employee.name, schema: employee_schema_1.EmployeeSchema },
                { name: shift_schema_1.Shift.name, schema: shift_schema_1.ShiftSchema },
                { name: shift_assignment_schema_1.ShiftAssignment.name, schema: shift_assignment_schema_1.ShiftAssignmentSchema },
                { name: holiday_schema_1.Holiday.name, schema: holiday_schema_1.HolidaySchema },
                { name: attendance_log_schema_1.AttendanceLog.name, schema: attendance_log_schema_1.AttendanceLogSchema },
                { name: leave_type_schema_1.LeaveType.name, schema: leave_type_schema_1.LeaveTypeSchema },
                { name: leave_balance_schema_1.LeaveBalance.name, schema: leave_balance_schema_1.LeaveBalanceSchema },
                { name: leave_request_schema_1.LeaveRequest.name, schema: leave_request_schema_1.LeaveRequestSchema },
                { name: ot_request_schema_1.OTRequest.name, schema: ot_request_schema_1.OTRequestSchema },
            ]),
        ],
        providers: [full_seed_service_1.FullSeedService],
    })
], FullSeedAppModule);
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(FullSeedAppModule, {
        logger: ['log', 'error', 'warn'],
    });
    const seedService = app.get(full_seed_service_1.FullSeedService);
    try {
        await seedService.run();
        console.log('Full seed completed successfully.');
    }
    catch (err) {
        console.error('Full seed failed:', err);
        process.exit(1);
    }
    finally {
        await app.close();
    }
}
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=full-seed-runner.js.map