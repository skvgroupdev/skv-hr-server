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
exports.LeaveTypeSchema = exports.LeaveType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let LeaveType = class LeaveType {
    tenantId;
    name;
    code;
    defaultDaysPerYear;
    isPaid;
    category;
    requireAttachment;
    isActive;
};
exports.LeaveType = LeaveType;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LeaveType.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], LeaveType.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], LeaveType.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], LeaveType.prototype, "defaultDaysPerYear", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], LeaveType.prototype, "isPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['LEAVE', 'REST_DAY'], default: 'LEAVE' }),
    __metadata("design:type", String)
], LeaveType.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], LeaveType.prototype, "requireAttachment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], LeaveType.prototype, "isActive", void 0);
exports.LeaveType = LeaveType = __decorate([
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
], LeaveType);
exports.LeaveTypeSchema = mongoose_1.SchemaFactory.createForClass(LeaveType);
exports.LeaveTypeSchema.index({ tenantId: 1 });
exports.LeaveTypeSchema.index({ tenantId: 1, code: 1 }, { unique: true });
//# sourceMappingURL=leave-type.schema.js.map