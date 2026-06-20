"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const leave_type_schema_1 = require("./schemas/leave-type.schema");
const leave_balance_schema_1 = require("./schemas/leave-balance.schema");
const leave_request_schema_1 = require("./schemas/leave-request.schema");
const leave_repository_1 = require("./leave.repository");
const leave_service_1 = require("./leave.service");
const leave_controller_1 = require("./leave.controller");
const employees_module_1 = require("../employees/employees.module");
const notifications_module_1 = require("../notifications/notifications.module");
const users_module_1 = require("../users/users.module");
let LeaveModule = class LeaveModule {
};
exports.LeaveModule = LeaveModule;
exports.LeaveModule = LeaveModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: leave_type_schema_1.LeaveType.name, schema: leave_type_schema_1.LeaveTypeSchema },
                { name: leave_balance_schema_1.LeaveBalance.name, schema: leave_balance_schema_1.LeaveBalanceSchema },
                { name: leave_request_schema_1.LeaveRequest.name, schema: leave_request_schema_1.LeaveRequestSchema },
            ]),
            employees_module_1.EmployeesModule,
            notifications_module_1.NotificationsModule,
            users_module_1.UsersModule,
        ],
        providers: [leave_repository_1.LeaveRepository, leave_service_1.LeaveService],
        controllers: [leave_controller_1.LeaveController],
        exports: [leave_repository_1.LeaveRepository, leave_service_1.LeaveService],
    })
], LeaveModule);
//# sourceMappingURL=leave.module.js.map