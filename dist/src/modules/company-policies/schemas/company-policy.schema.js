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
exports.CompanyPolicySchema = exports.CompanyPolicy = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CompanyPolicy = class CompanyPolicy {
    tenantId;
    effectiveFrom;
    workScheduleMode;
    uniformSchedule;
    salaryCalculationMode;
    dailyRateMethod;
    restDayPolicyEnabled;
    monthlyRestDays;
    unusedRestDayCompensationEnabled;
    unusedRestDaysCarryForward;
    lateToleranceMinutes;
    earlyLeaveToleranceMinutes;
    absenceDeductionEnabled;
    createdBy;
};
exports.CompanyPolicy = CompanyPolicy;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CompanyPolicy.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], CompanyPolicy.prototype, "effectiveFrom", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['UNIFORM', 'SHIFT_BASED'], default: 'UNIFORM' }),
    __metadata("design:type", String)
], CompanyPolicy.prototype, "workScheduleMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            startTime: String,
            endTime: String,
            breakStartTime: String,
            breakEndTime: String,
            workDays: [Number],
            gracePeriodMinutes: Number,
            isOvernight: Boolean,
        },
        default: {
            startTime: '09:00',
            endTime: '18:00',
            workDays: [1, 2, 3, 4, 5],
            gracePeriodMinutes: 15,
            isOvernight: false,
        },
    }),
    __metadata("design:type", Object)
], CompanyPolicy.prototype, "uniformSchedule", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['MONTHLY_FIXED', 'ATTENDANCE_BASED'],
        default: 'MONTHLY_FIXED',
    }),
    __metadata("design:type", String)
], CompanyPolicy.prototype, "salaryCalculationMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['CALENDAR_30', 'SCHEDULED_WORKDAYS'],
        default: 'CALENDAR_30',
    }),
    __metadata("design:type", String)
], CompanyPolicy.prototype, "dailyRateMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], CompanyPolicy.prototype, "restDayPolicyEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 4, min: 0 }),
    __metadata("design:type", Number)
], CompanyPolicy.prototype, "monthlyRestDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], CompanyPolicy.prototype, "unusedRestDayCompensationEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], CompanyPolicy.prototype, "unusedRestDaysCarryForward", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 15, min: 0 }),
    __metadata("design:type", Number)
], CompanyPolicy.prototype, "lateToleranceMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], CompanyPolicy.prototype, "earlyLeaveToleranceMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], CompanyPolicy.prototype, "absenceDeductionEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CompanyPolicy.prototype, "createdBy", void 0);
exports.CompanyPolicy = CompanyPolicy = __decorate([
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
], CompanyPolicy);
exports.CompanyPolicySchema = mongoose_1.SchemaFactory.createForClass(CompanyPolicy);
exports.CompanyPolicySchema.index({ tenantId: 1, effectiveFrom: -1 });
//# sourceMappingURL=company-policy.schema.js.map