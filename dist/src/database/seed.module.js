"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const seed_service_1 = require("./seed.service");
const user_schema_1 = require("../modules/users/schemas/user.schema");
const tax_config_schema_1 = require("../modules/tax-configs/schemas/tax-config.schema");
const plan_schema_1 = require("../modules/plans/schemas/plan.schema");
const position_schema_1 = require("../modules/positions/schemas/position.schema");
const employee_schema_1 = require("../modules/employees/schemas/employee.schema");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: tax_config_schema_1.TaxConfig.name, schema: tax_config_schema_1.TaxConfigSchema },
                { name: plan_schema_1.Plan.name, schema: plan_schema_1.PlanSchema },
                { name: position_schema_1.Position.name, schema: position_schema_1.PositionSchema },
                { name: employee_schema_1.Employee.name, schema: employee_schema_1.EmployeeSchema },
            ]),
        ],
        providers: [seed_service_1.SeedService],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map