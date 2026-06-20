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
exports.OutsideWorkSchema = exports.OutsideWork = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let OutsideWork = class OutsideWork {
    tenantId;
    employeeId;
    managerId;
    attendanceLogId;
    outsideType;
    reason;
    locationName;
    location;
    gpsAccuracy;
    photoUrls;
    status;
    approvedBy;
    approvedAt;
    rejectedBy;
    rejectedAt;
    rejectReason;
};
exports.OutsideWork = OutsideWork;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OutsideWork.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OutsideWork.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OutsideWork.prototype, "managerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AttendanceLog' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OutsideWork.prototype, "attendanceLogId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['OUTSIDE_WORK', 'CUSTOMER_VISIT', 'DELIVERY', 'WORK_FROM_HOME', 'BUSINESS_TRIP', 'EMERGENCY', 'OTHER'],
        required: true,
    }),
    __metadata("design:type", String)
], OutsideWork.prototype, "outsideType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OutsideWork.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OutsideWork.prototype, "locationName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], OutsideWork.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], OutsideWork.prototype, "gpsAccuracy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], OutsideWork.prototype, "photoUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
    }),
    __metadata("design:type", String)
], OutsideWork.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OutsideWork.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], OutsideWork.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OutsideWork.prototype, "rejectedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], OutsideWork.prototype, "rejectedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OutsideWork.prototype, "rejectReason", void 0);
exports.OutsideWork = OutsideWork = __decorate([
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
], OutsideWork);
exports.OutsideWorkSchema = mongoose_1.SchemaFactory.createForClass(OutsideWork);
exports.OutsideWorkSchema.index({ tenantId: 1, employeeId: 1 });
exports.OutsideWorkSchema.index({ tenantId: 1, status: 1 });
//# sourceMappingURL=outside-work.schema.js.map