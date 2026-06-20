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
exports.UpdatePayrollPolicyDto = void 0;
const class_validator_1 = require("class-validator");
class UpdatePayrollPolicyDto {
    salaryCalculationMode;
    dailyRateMethod;
    restDayPolicyEnabled;
    monthlyRestDays;
    unusedRestDayCompensationEnabled;
    unusedRestDaysCarryForward;
    lateToleranceMinutes;
    earlyLeaveToleranceMinutes;
    absenceDeductionEnabled;
    effectiveFrom;
}
exports.UpdatePayrollPolicyDto = UpdatePayrollPolicyDto;
__decorate([
    (0, class_validator_1.IsEnum)(['MONTHLY_FIXED', 'ATTENDANCE_BASED']),
    __metadata("design:type", String)
], UpdatePayrollPolicyDto.prototype, "salaryCalculationMode", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CALENDAR_30', 'SCHEDULED_WORKDAYS']),
    __metadata("design:type", String)
], UpdatePayrollPolicyDto.prototype, "dailyRateMethod", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePayrollPolicyDto.prototype, "restDayPolicyEnabled", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePayrollPolicyDto.prototype, "monthlyRestDays", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePayrollPolicyDto.prototype, "unusedRestDayCompensationEnabled", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePayrollPolicyDto.prototype, "unusedRestDaysCarryForward", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePayrollPolicyDto.prototype, "lateToleranceMinutes", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePayrollPolicyDto.prototype, "earlyLeaveToleranceMinutes", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePayrollPolicyDto.prototype, "absenceDeductionEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePayrollPolicyDto.prototype, "effectiveFrom", void 0);
//# sourceMappingURL=update-payroll-policy.dto.js.map