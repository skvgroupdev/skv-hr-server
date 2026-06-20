"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyTaxConfigsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const company_tax_config_schema_1 = require("./schemas/company-tax-config.schema");
let CompanyTaxConfigsRepository = class CompanyTaxConfigsRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    findByTenant(tenantId) {
        return this.model.findOne({ tenantId: new mongoose_2.Types.ObjectId(tenantId) }).exec();
    }
    async upsertByTenant(tenantId, dto, updatedBy) {
        const updatePayload = {
            ...(dto.taxConfigId && { taxConfigId: new mongoose_2.Types.ObjectId(dto.taxConfigId) }),
            ...(dto.taxMode !== undefined && { taxMode: dto.taxMode }),
            ...(dto.enableEmployeeSs !== undefined && { enableEmployeeSs: dto.enableEmployeeSs }),
            ...(dto.enableEmployerSs !== undefined && { enableEmployerSs: dto.enableEmployerSs }),
            ...(dto.enableIncomeTax !== undefined && { enableIncomeTax: dto.enableIncomeTax }),
            ...(updatedBy && { updatedBy: new mongoose_2.Types.ObjectId(updatedBy) }),
        };
        const result = await this.model
            .findOneAndUpdate({ tenantId: new mongoose_2.Types.ObjectId(tenantId) }, { $set: updatePayload }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true })
            .exec();
        return result;
    }
    createDefault(tenantId, taxConfigId) {
        return this.model.create({
            tenantId: new mongoose_2.Types.ObjectId(tenantId),
            taxConfigId: new mongoose_2.Types.ObjectId(taxConfigId),
            taxMode: company_tax_config_schema_1.TaxMode.FULL_DEDUCTION,
            enableEmployeeSs: true,
            enableEmployerSs: true,
            enableIncomeTax: true,
        });
    }
    findAll() {
        return this.model.find().exec();
    }
};
exports.CompanyTaxConfigsRepository = CompanyTaxConfigsRepository;
exports.CompanyTaxConfigsRepository = CompanyTaxConfigsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(company_tax_config_schema_1.CompanyTaxConfig.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CompanyTaxConfigsRepository);
//# sourceMappingURL=company-tax-configs.repository.js.map