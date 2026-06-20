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
exports.OTPolicySchema = exports.OTPolicy = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let OTPolicy = class OTPolicy {
    tenantId;
    weekdayRate;
    weekendRate;
    holidayRate;
    beforeWorkAllowed;
    afterWorkAllowed;
    minOtMinutes;
    maxOtHoursPerDay;
    requirePreApproval;
    compareWithCheckout;
};
exports.OTPolicy = OTPolicy;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true, unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OTPolicy.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1.5 }),
    __metadata("design:type", Number)
], OTPolicy.prototype, "weekdayRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 2.0 }),
    __metadata("design:type", Number)
], OTPolicy.prototype, "weekendRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 3.0 }),
    __metadata("design:type", Number)
], OTPolicy.prototype, "holidayRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], OTPolicy.prototype, "beforeWorkAllowed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], OTPolicy.prototype, "afterWorkAllowed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 30 }),
    __metadata("design:type", Number)
], OTPolicy.prototype, "minOtMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 4 }),
    __metadata("design:type", Number)
], OTPolicy.prototype, "maxOtHoursPerDay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], OTPolicy.prototype, "requirePreApproval", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], OTPolicy.prototype, "compareWithCheckout", void 0);
exports.OTPolicy = OTPolicy = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: { createdAt: false, updatedAt: true },
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete ret._id;
            },
        },
    })
], OTPolicy);
exports.OTPolicySchema = mongoose_1.SchemaFactory.createForClass(OTPolicy);
//# sourceMappingURL=ot-policy.schema.js.map