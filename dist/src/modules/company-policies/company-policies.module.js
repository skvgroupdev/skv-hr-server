"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyPoliciesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const company_policy_schema_1 = require("./schemas/company-policy.schema");
const company_policies_repository_1 = require("./company-policies.repository");
const company_policies_service_1 = require("./company-policies.service");
const company_policies_controller_1 = require("./company-policies.controller");
const companies_module_1 = require("../companies/companies.module");
const plans_module_1 = require("../plans/plans.module");
const audit_log_module_1 = require("../audit-logs/audit-log.module");
let CompanyPoliciesModule = class CompanyPoliciesModule {
};
exports.CompanyPoliciesModule = CompanyPoliciesModule;
exports.CompanyPoliciesModule = CompanyPoliciesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: company_policy_schema_1.CompanyPolicy.name, schema: company_policy_schema_1.CompanyPolicySchema },
            ]),
            companies_module_1.CompaniesModule,
            plans_module_1.PlansModule,
            audit_log_module_1.AuditLogModule,
        ],
        providers: [company_policies_repository_1.CompanyPoliciesRepository, company_policies_service_1.CompanyPoliciesService],
        controllers: [company_policies_controller_1.CompanyPoliciesController],
        exports: [company_policies_repository_1.CompanyPoliciesRepository, company_policies_service_1.CompanyPoliciesService],
    })
], CompanyPoliciesModule);
//# sourceMappingURL=company-policies.module.js.map