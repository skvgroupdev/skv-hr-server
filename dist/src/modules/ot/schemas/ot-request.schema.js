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
exports.OTRequestSchema = exports.OTRequest = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let OTRequest = class OTRequest {
    tenantId;
    employeeId;
    date;
    startTime;
    endTime;
    totalHours;
    dayType;
    reason;
    status;
    approvalFlow;
};
exports.OTRequest = OTRequest;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OTRequest.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OTRequest.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], OTRequest.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], OTRequest.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], OTRequest.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], OTRequest.prototype, "totalHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['weekday', 'weekend', 'holiday'], default: 'weekday' }),
    __metadata("design:type", String)
], OTRequest.prototype, "dayType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OTRequest.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
        default: 'PENDING',
    }),
    __metadata("design:type", String)
], OTRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                approverId: { type: mongoose_2.Types.ObjectId, ref: 'User' },
                role: String,
                status: String,
                comment: String,
                approvedAt: Date,
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], OTRequest.prototype, "approvalFlow", void 0);
exports.OTRequest = OTRequest = __decorate([
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
], OTRequest);
exports.OTRequestSchema = mongoose_1.SchemaFactory.createForClass(OTRequest);
exports.OTRequestSchema.index({ tenantId: 1, employeeId: 1 });
exports.OTRequestSchema.index({ tenantId: 1, status: 1 });
//# sourceMappingURL=ot-request.schema.js.map