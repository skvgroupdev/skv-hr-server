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
exports.LeaveRequestSchema = exports.LeaveRequest = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let LeaveRequest = class LeaveRequest {
    tenantId;
    employeeId;
    leaveTypeId;
    leaveTypeName;
    startDate;
    endDate;
    totalDays;
    isHalfDay;
    halfDayPeriod;
    reason;
    attachmentUrls;
    status;
    currentApprovalStep;
    approvals;
};
exports.LeaveRequest = LeaveRequest;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LeaveRequest.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LeaveRequest.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'LeaveType', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LeaveRequest.prototype, "leaveTypeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "leaveTypeName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], LeaveRequest.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], LeaveRequest.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "totalDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], LeaveRequest.prototype, "isHalfDay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['AM', 'PM'] }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "halfDayPeriod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], LeaveRequest.prototype, "attachmentUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
        default: 'PENDING',
    }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "currentApprovalStep", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                approverId: { type: mongoose_2.Types.ObjectId, ref: 'User' },
                role: String,
                status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'] },
                comment: String,
                approvedAt: Date,
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], LeaveRequest.prototype, "approvals", void 0);
exports.LeaveRequest = LeaveRequest = __decorate([
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
], LeaveRequest);
exports.LeaveRequestSchema = mongoose_1.SchemaFactory.createForClass(LeaveRequest);
exports.LeaveRequestSchema.index({ tenantId: 1, employeeId: 1 });
exports.LeaveRequestSchema.index({ tenantId: 1, status: 1 });
//# sourceMappingURL=leave-request.schema.js.map