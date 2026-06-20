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
exports.ShiftSchema = exports.Shift = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Shift = class Shift {
    tenantId;
    name;
    startTime;
    endTime;
    breakStartTime;
    breakEndTime;
    gracePeriodMinutes;
    isOvernight;
    workDays;
    isActive;
};
exports.Shift = Shift;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Shift.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Shift.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shift.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shift.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shift.prototype, "breakStartTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shift.prototype, "breakEndTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 15 }),
    __metadata("design:type", Number)
], Shift.prototype, "gracePeriodMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Shift.prototype, "isOvernight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number], default: [1, 2, 3, 4, 5] }),
    __metadata("design:type", Array)
], Shift.prototype, "workDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Shift.prototype, "isActive", void 0);
exports.Shift = Shift = __decorate([
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
], Shift);
exports.ShiftSchema = mongoose_1.SchemaFactory.createForClass(Shift);
exports.ShiftSchema.index({ tenantId: 1 });
//# sourceMappingURL=shift.schema.js.map