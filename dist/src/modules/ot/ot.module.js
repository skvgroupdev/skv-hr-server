"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const ot_policy_schema_1 = require("./schemas/ot-policy.schema");
const ot_request_schema_1 = require("./schemas/ot-request.schema");
const ot_repository_1 = require("./ot.repository");
const ot_service_1 = require("./ot.service");
const ot_controller_1 = require("./ot.controller");
const employees_module_1 = require("../employees/employees.module");
const notifications_module_1 = require("../notifications/notifications.module");
const users_module_1 = require("../users/users.module");
let OTModule = class OTModule {
};
exports.OTModule = OTModule;
exports.OTModule = OTModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: ot_policy_schema_1.OTPolicy.name, schema: ot_policy_schema_1.OTPolicySchema },
                { name: ot_request_schema_1.OTRequest.name, schema: ot_request_schema_1.OTRequestSchema },
            ]),
            employees_module_1.EmployeesModule,
            notifications_module_1.NotificationsModule,
            users_module_1.UsersModule,
        ],
        providers: [ot_repository_1.OTRepository, ot_service_1.OTService],
        controllers: [ot_controller_1.OTController],
        exports: [ot_repository_1.OTRepository, ot_service_1.OTService],
    })
], OTModule);
//# sourceMappingURL=ot.module.js.map