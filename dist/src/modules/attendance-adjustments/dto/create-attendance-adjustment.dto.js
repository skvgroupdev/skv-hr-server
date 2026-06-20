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
exports.CreateAttendanceAdjustmentDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAttendanceAdjustmentDto {
    attendanceLogId;
    type;
    workDate;
    requestedCheckTime;
    reason;
    evidenceUrl;
}
exports.CreateAttendanceAdjustmentDto = CreateAttendanceAdjustmentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateAttendanceAdjustmentDto.prototype, "attendanceLogId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CHECK_IN', 'CHECK_OUT']),
    __metadata("design:type", String)
], CreateAttendanceAdjustmentDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAttendanceAdjustmentDto.prototype, "workDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAttendanceAdjustmentDto.prototype, "requestedCheckTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateAttendanceAdjustmentDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateAttendanceAdjustmentDto.prototype, "evidenceUrl", void 0);
//# sourceMappingURL=create-attendance-adjustment.dto.js.map