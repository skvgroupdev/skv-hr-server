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
exports.TaxConfigSchema = exports.TaxConfig = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let TaxConfig = class TaxConfig {
    country;
    year;
    currency;
    brackets;
    employeeSsRate;
    employerSsRate;
    effectiveFrom;
};
exports.TaxConfig = TaxConfig;
__decorate([
    (0, mongoose_1.Prop)({ default: 'LA' }),
    __metadata("design:type", String)
], TaxConfig.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TaxConfig.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'LAK' }),
    __metadata("design:type", String)
], TaxConfig.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ from: Number, to: Number, rate: Number }],
        required: true,
    }),
    __metadata("design:type", Array)
], TaxConfig.prototype, "brackets", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0.055 }),
    __metadata("design:type", Number)
], TaxConfig.prototype, "employeeSsRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0.06 }),
    __metadata("design:type", Number)
], TaxConfig.prototype, "employerSsRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], TaxConfig.prototype, "effectiveFrom", void 0);
exports.TaxConfig = TaxConfig = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete ret._id;
            },
        },
    })
], TaxConfig);
exports.TaxConfigSchema = mongoose_1.SchemaFactory.createForClass(TaxConfig);
exports.TaxConfigSchema.index({ country: 1, year: -1 });
//# sourceMappingURL=tax-config.schema.js.map