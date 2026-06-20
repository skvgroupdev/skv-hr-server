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
exports.CreateTaxConfigDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class TaxBracketDto {
    from;
    to;
    rate;
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TaxBracketDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], TaxBracketDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TaxBracketDto.prototype, "rate", void 0);
class CreateTaxConfigDto {
    country;
    year;
    currency;
    brackets;
    employeeSsRate;
    employerSsRate;
    effectiveFrom;
}
exports.CreateTaxConfigDto = CreateTaxConfigDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaxConfigDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaxConfigDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaxConfigDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TaxBracketDto),
    __metadata("design:type", Array)
], CreateTaxConfigDto.prototype, "brackets", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaxConfigDto.prototype, "employeeSsRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaxConfigDto.prototype, "employerSsRate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTaxConfigDto.prototype, "effectiveFrom", void 0);
//# sourceMappingURL=create-tax-config.dto.js.map