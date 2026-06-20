"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutsideWorkModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const outside_work_schema_1 = require("./schemas/outside-work.schema");
const outside_work_repository_1 = require("./outside-work.repository");
const outside_work_service_1 = require("./outside-work.service");
const outside_work_controller_1 = require("./outside-work.controller");
const attendance_module_1 = require("../attendance/attendance.module");
const employees_module_1 = require("../employees/employees.module");
const notifications_module_1 = require("../notifications/notifications.module");
const users_module_1 = require("../users/users.module");
let OutsideWorkModule = class OutsideWorkModule {
};
exports.OutsideWorkModule = OutsideWorkModule;
exports.OutsideWorkModule = OutsideWorkModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: outside_work_schema_1.OutsideWork.name, schema: outside_work_schema_1.OutsideWorkSchema }]),
            attendance_module_1.AttendanceModule,
            employees_module_1.EmployeesModule,
            notifications_module_1.NotificationsModule,
            users_module_1.UsersModule,
        ],
        providers: [outside_work_repository_1.OutsideWorkRepository, outside_work_service_1.OutsideWorkService],
        controllers: [outside_work_controller_1.OutsideWorkController],
        exports: [outside_work_repository_1.OutsideWorkRepository],
    })
], OutsideWorkModule);
//# sourceMappingURL=outside-work.module.js.map