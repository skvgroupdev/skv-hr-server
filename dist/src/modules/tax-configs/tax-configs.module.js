"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxConfigsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const tax_config_schema_1 = require("./schemas/tax-config.schema");
const company_tax_config_schema_1 = require("./schemas/company-tax-config.schema");
const tax_configs_repository_1 = require("./tax-configs.repository");
const company_tax_configs_repository_1 = require("./company-tax-configs.repository");
const tax_configs_service_1 = require("./tax-configs.service");
const tax_configs_controller_1 = require("./tax-configs.controller");
const tax_calculation_service_1 = require("./tax-calculation.service");
let TaxConfigsModule = class TaxConfigsModule {
};
exports.TaxConfigsModule = TaxConfigsModule;
exports.TaxConfigsModule = TaxConfigsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: tax_config_schema_1.TaxConfig.name, schema: tax_config_schema_1.TaxConfigSchema },
                { name: company_tax_config_schema_1.CompanyTaxConfig.name, schema: company_tax_config_schema_1.CompanyTaxConfigSchema },
            ]),
        ],
        providers: [tax_configs_repository_1.TaxConfigsRepository, company_tax_configs_repository_1.CompanyTaxConfigsRepository, tax_configs_service_1.TaxConfigsService, tax_calculation_service_1.TaxCalculationService],
        controllers: [tax_configs_controller_1.TaxConfigsController],
        exports: [tax_configs_repository_1.TaxConfigsRepository, company_tax_configs_repository_1.CompanyTaxConfigsRepository, tax_configs_service_1.TaxConfigsService, tax_calculation_service_1.TaxCalculationService],
    })
], TaxConfigsModule);
//# sourceMappingURL=tax-configs.module.js.map