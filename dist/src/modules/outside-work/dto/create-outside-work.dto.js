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
exports.CreateOutsideWorkDto = void 0;
const class_validator_1 = require("class-validator");
class CreateOutsideWorkDto {
    outsideType;
    reason;
    locationName;
    lat;
    lng;
    gpsAccuracy;
    photoUrls;
    attendanceLogId;
}
exports.CreateOutsideWorkDto = CreateOutsideWorkDto;
__decorate([
    (0, class_validator_1.IsEnum)(['OUTSIDE_WORK', 'CUSTOMER_VISIT', 'DELIVERY', 'WORK_FROM_HOME', 'BUSINESS_TRIP', 'EMERGENCY', 'OTHER']),
    __metadata("design:type", String)
], CreateOutsideWorkDto.prototype, "outsideType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutsideWorkDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutsideWorkDto.prototype, "locationName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], CreateOutsideWorkDto.prototype, "lat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], CreateOutsideWorkDto.prototype, "lng", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateOutsideWorkDto.prototype, "gpsAccuracy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateOutsideWorkDto.prototype, "photoUrls", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutsideWorkDto.prototype, "attendanceLogId", void 0);
//# sourceMappingURL=create-outside-work.dto.js.map