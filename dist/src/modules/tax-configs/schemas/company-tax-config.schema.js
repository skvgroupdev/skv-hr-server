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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyTaxConfigSchema = exports.CompanyTaxConfig = exports.TaxMode = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var TaxMode;
(function (TaxMode) {
    TaxMode["FULL_DEDUCTION"] = "FULL_DEDUCTION";
    TaxMode["TAX_ON_COMPANY"] = "TAX_ON_COMPANY";
    TaxMode["SS_ONLY"] = "SS_ONLY";
    TaxMode["NO_DEDUCTION"] = "NO_DEDUCTION";
})(TaxMode || (exports.TaxMode = TaxMode = {}));
let CompanyTaxConfig = class CompanyTaxConfig {
    tenantId;
    taxConfigId;
    taxMode;
    enableEmployeeSs;
    enableEmployerSs;
    enableIncomeTax;
    updatedBy;
};
exports.CompanyTaxConfig = CompanyTaxConfig;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true, unique: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CompanyTaxConfig.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'TaxConfig', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CompanyTaxConfig.prototype, "taxConfigId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: TaxMode, default: TaxMode.FULL_DEDUCTION }),
    __metadata("design:type", String)
], CompanyTaxConfig.prototype, "taxMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CompanyTaxConfig.prototype, "enableEmployeeSs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CompanyTaxConfig.prototype, "enableEmployerSs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CompanyTaxConfig.prototype, "enableIncomeTax", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CompanyTaxConfig.prototype, "updatedBy", void 0);
exports.CompanyTaxConfig = CompanyTaxConfig = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete ret._id;
            },
        },
    })
], CompanyTaxConfig);
exports.CompanyTaxConfigSchema = mongoose_1.SchemaFactory.createForClass(CompanyTaxConfig);
//# sourceMappingURL=company-tax-config.schema.js.map