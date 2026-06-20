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
exports.AttendanceAdjustmentSchema = exports.AttendanceAdjustment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AttendanceAdjustment = class AttendanceAdjustment {
    tenantId;
    employeeId;
    branchId;
    attendanceLogId;
    correctionLogId;
    type;
    workDate;
    originalCheckTime;
    requestedCheckTime;
    reason;
    evidenceUrl;
    status;
    reviewedBy;
    reviewComment;
    reviewedAt;
};
exports.AttendanceAdjustment = AttendanceAdjustment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AttendanceAdjustment.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AttendanceAdjustment.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Branch', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AttendanceAdjustment.prototype, "branchId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AttendanceLog' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AttendanceAdjustment.prototype, "attendanceLogId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AttendanceLog' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AttendanceAdjustment.prototype, "correctionLogId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['CHECK_IN', 'CHECK_OUT'], required: true }),
    __metadata("design:type", String)
], AttendanceAdjustment.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], AttendanceAdjustment.prototype, "workDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], AttendanceAdjustment.prototype, "originalCheckTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], AttendanceAdjustment.prototype, "requestedCheckTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], AttendanceAdjustment.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AttendanceAdjustment.prototype, "evidenceUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
        default: 'PENDING',
    }),
    __metadata("design:type", String)
], AttendanceAdjustment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AttendanceAdjustment.prototype, "reviewedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AttendanceAdjustment.prototype, "reviewComment", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], AttendanceAdjustment.prototype, "reviewedAt", void 0);
exports.AttendanceAdjustment = AttendanceAdjustment = __decorate([
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
], AttendanceAdjustment);
exports.AttendanceAdjustmentSchema = mongoose_1.SchemaFactory.createForClass(AttendanceAdjustment);
exports.AttendanceAdjustmentSchema.index({ tenantId: 1, employeeId: 1, createdAt: -1 });
exports.AttendanceAdjustmentSchema.index({
    tenantId: 1,
    branchId: 1,
    status: 1,
    createdAt: -1,
});
exports.AttendanceAdjustmentSchema.index({ tenantId: 1, employeeId: 1, workDate: 1, type: 1 }, { unique: true, partialFilterExpression: { status: 'PENDING' } });
//# sourceMappingURL=attendance-adjustment.schema.js.map