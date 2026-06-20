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
exports.AttendanceLogSchema = exports.AttendanceLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AttendanceLog = class AttendanceLog {
    tenantId;
    employeeId;
    branchId;
    type;
    checkTime;
    serverTime;
    location;
    gpsAccuracy;
    distanceFromBranch;
    isInsideGeofence;
    selfieUrl;
    deviceId;
    ipAddress;
    status;
    lateMinutes;
    note;
    adjustedBy;
    adjustReason;
    earlyLeaveReason;
    scheduleSnapshot;
    correctionFor;
};
exports.AttendanceLog = AttendanceLog;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AttendanceLog.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AttendanceLog.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Branch' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AttendanceLog.prototype, "branchId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: [
            'CHECK_IN',
            'CHECK_OUT',
            'BREAK_IN',
            'BREAK_OUT',
            'MANUAL_ADJUSTMENT',
        ],
        required: true,
    }),
    __metadata("design:type", String)
], AttendanceLog.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], AttendanceLog.prototype, "checkTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], AttendanceLog.prototype, "serverTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: [Number],
    }),
    __metadata("design:type", Object)
], AttendanceLog.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], AttendanceLog.prototype, "gpsAccuracy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], AttendanceLog.prototype, "distanceFromBranch", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], AttendanceLog.prototype, "isInsideGeofence", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AttendanceLog.prototype, "selfieUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AttendanceLog.prototype, "deviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AttendanceLog.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: [
            'NORMAL',
            'LATE_MINOR',
            'LATE',
            'EARLY_LEAVE',
            'ABSENT',
            'MISSING_CHECKOUT',
            'OUTSIDE_PENDING',
            'OUTSIDE_APPROVED',
            'OUTSIDE_REJECTED',
            'MANUAL_ADJUSTED',
        ],
        default: 'NORMAL',
    }),
    __metadata("design:type", String)
], AttendanceLog.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], AttendanceLog.prototype, "lateMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AttendanceLog.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AttendanceLog.prototype, "adjustedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AttendanceLog.prototype, "adjustReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], AttendanceLog.prototype, "earlyLeaveReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AttendanceLog.prototype, "scheduleSnapshot", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AttendanceLog' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AttendanceLog.prototype, "correctionFor", void 0);
exports.AttendanceLog = AttendanceLog = __decorate([
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
], AttendanceLog);
exports.AttendanceLogSchema = mongoose_1.SchemaFactory.createForClass(AttendanceLog);
exports.AttendanceLogSchema.index({ tenantId: 1, employeeId: 1, checkTime: -1 });
exports.AttendanceLogSchema.index({ location: '2dsphere' }, { sparse: true });
//# sourceMappingURL=attendance-log.schema.js.map