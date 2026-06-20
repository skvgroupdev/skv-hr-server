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
exports.UpdateAttendancePolicyDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
class UniformScheduleDto {
    startTime;
    endTime;
    breakStartTime;
    breakEndTime;
    workDays;
    gracePeriodMinutes;
    isOvernight;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(TIME_PATTERN),
    __metadata("design:type", String)
], UniformScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(TIME_PATTERN),
    __metadata("design:type", String)
], UniformScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(TIME_PATTERN),
    __metadata("design:type", String)
], UniformScheduleDto.prototype, "breakStartTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(TIME_PATTERN),
    __metadata("design:type", String)
], UniformScheduleDto.prototype, "breakEndTime", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(0, { each: true }),
    (0, class_validator_1.Max)(6, { each: true }),
    __metadata("design:type", Array)
], UniformScheduleDto.prototype, "workDays", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UniformScheduleDto.prototype, "gracePeriodMinutes", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UniformScheduleDto.prototype, "isOvernight", void 0);
class UpdateAttendancePolicyDto {
    workScheduleMode;
    uniformSchedule;
    effectiveFrom;
}
exports.UpdateAttendancePolicyDto = UpdateAttendancePolicyDto;
__decorate([
    (0, class_validator_1.IsEnum)(['UNIFORM', 'SHIFT_BASED']),
    __metadata("design:type", String)
], UpdateAttendancePolicyDto.prototype, "workScheduleMode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UniformScheduleDto),
    __metadata("design:type", UniformScheduleDto)
], UpdateAttendancePolicyDto.prototype, "uniformSchedule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateAttendancePolicyDto.prototype, "effectiveFrom", void 0);
//# sourceMappingURL=update-attendance-policy.dto.js.map