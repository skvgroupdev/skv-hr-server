"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const position_schema_1 = require("./schemas/position.schema");
const positions_repository_1 = require("./positions.repository");
const positions_service_1 = require("./positions.service");
const positions_controller_1 = require("./positions.controller");
const audit_log_module_1 = require("../audit-logs/audit-log.module");
let PositionsModule = class PositionsModule {
};
exports.PositionsModule = PositionsModule;
exports.PositionsModule = PositionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: position_schema_1.Position.name, schema: position_schema_1.PositionSchema }]),
            audit_log_module_1.AuditLogModule,
        ],
        providers: [positions_repository_1.PositionsRepository, positions_service_1.PositionsService],
        controllers: [positions_controller_1.PositionsController],
        exports: [positions_repository_1.PositionsRepository],
    })
], PositionsModule);
//# sourceMappingURL=positions.module.js.map