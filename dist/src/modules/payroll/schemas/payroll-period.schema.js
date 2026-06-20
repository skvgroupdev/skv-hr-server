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
exports.PayrollPeriodSchema = exports.PayrollPeriod = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let PayrollPeriod = class PayrollPeriod {
    tenantId;
    name;
    startDate;
    endDate;
    status;
    generatedBy;
    approvedBy;
    hrReviewedBy;
    hrReviewedAt;
    paidBy;
    paidAt;
    lockedBy;
};
exports.PayrollPeriod = PayrollPeriod;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PayrollPeriod.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], PayrollPeriod.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], PayrollPeriod.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], PayrollPeriod.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['DRAFT', 'GENERATED', 'HR_REVIEWED', 'PAID', 'APPROVED', 'LOCKED'],
        default: 'DRAFT',
    }),
    __metadata("design:type", String)
], PayrollPeriod.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PayrollPeriod.prototype, "generatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PayrollPeriod.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PayrollPeriod.prototype, "hrReviewedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], PayrollPeriod.prototype, "hrReviewedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PayrollPeriod.prototype, "paidBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], PayrollPeriod.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PayrollPeriod.prototype, "lockedBy", void 0);
exports.PayrollPeriod = PayrollPeriod = __decorate([
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
], PayrollPeriod);
exports.PayrollPeriodSchema = mongoose_1.SchemaFactory.createForClass(PayrollPeriod);
exports.PayrollPeriodSchema.index({ tenantId: 1 });
//# sourceMappingURL=payroll-period.schema.js.map