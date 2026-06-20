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
exports.LeaveBalanceSchema = exports.LeaveBalance = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let LeaveBalance = class LeaveBalance {
    tenantId;
    employeeId;
    leaveTypeId;
    year;
    totalDays;
    usedDays;
    remainingDays;
};
exports.LeaveBalance = LeaveBalance;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LeaveBalance.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LeaveBalance.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'LeaveType', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LeaveBalance.prototype, "leaveTypeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "totalDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "usedDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], LeaveBalance.prototype, "remainingDays", void 0);
exports.LeaveBalance = LeaveBalance = __decorate([
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
], LeaveBalance);
exports.LeaveBalanceSchema = mongoose_1.SchemaFactory.createForClass(LeaveBalance);
exports.LeaveBalanceSchema.index({ tenantId: 1, employeeId: 1, year: 1 });
exports.LeaveBalanceSchema.index({ tenantId: 1, employeeId: 1, leaveTypeId: 1, year: 1 }, { unique: true });
//# sourceMappingURL=leave-balance.schema.js.map