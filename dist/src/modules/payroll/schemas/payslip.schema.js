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
exports.PayslipSchema = exports.Payslip = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Payslip = class Payslip {
    tenantId;
    payrollPeriodId;
    employeeId;
    baseSalary;
    allowances;
    otHours;
    otAmount;
    grossSalary;
    employeeSsAmount;
    taxableIncome;
    incomeTax;
    otherDeductions;
    totalDeductions;
    netSalary;
    employerSsAmount;
    taxConfigSnapshot;
    taxMode;
    leaveDeductionDays;
    leaveDeductionAmount;
    approvedRestDays;
    unusedRestDays;
    restDayCompensationAmount;
    payrollPolicySnapshot;
    adjustments;
    status;
};
exports.Payslip = Payslip;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Payslip.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'PayrollPeriod', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Payslip.prototype, "payrollPeriodId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Payslip.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "baseSalary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ name: String, amount: Number }], default: [] }),
    __metadata("design:type", Array)
], Payslip.prototype, "allowances", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "otHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "otAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "grossSalary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "employeeSsAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "taxableIncome", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "incomeTax", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ name: String, amount: Number }], default: [] }),
    __metadata("design:type", Array)
], Payslip.prototype, "otherDeductions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "totalDeductions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "netSalary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "employerSsAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Payslip.prototype, "taxConfigSnapshot", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Payslip.prototype, "taxMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "leaveDeductionDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "leaveDeductionAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "approvedRestDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "unusedRestDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "restDayCompensationAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Payslip.prototype, "payrollPolicySnapshot", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                kind: { type: String, enum: ['ADDITION', 'DEDUCTION'] },
                name: String,
                amount: Number,
                reason: String,
                source: {
                    type: String,
                    enum: ['SYSTEM', 'MANUAL', 'PREVIOUS_PERIOD_CORRECTION'],
                },
                createdBy: { type: mongoose_2.Types.ObjectId, ref: 'User' },
                createdAt: Date,
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Payslip.prototype, "adjustments", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['DRAFT', 'HR_REVIEWED', 'PAID', 'APPROVED'],
        default: 'DRAFT',
    }),
    __metadata("design:type", String)
], Payslip.prototype, "status", void 0);
exports.Payslip = Payslip = __decorate([
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
], Payslip);
exports.PayslipSchema = mongoose_1.SchemaFactory.createForClass(Payslip);
exports.PayslipSchema.index({ tenantId: 1, payrollPeriodId: 1 });
exports.PayslipSchema.index({ tenantId: 1, employeeId: 1 });
//# sourceMappingURL=payslip.schema.js.map