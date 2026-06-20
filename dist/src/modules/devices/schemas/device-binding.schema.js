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
exports.DeviceBindingSchema = exports.DeviceBinding = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DeviceBinding = class DeviceBinding {
    tenantId;
    userId;
    deviceId;
    deviceName;
    boundAt;
};
exports.DeviceBinding = DeviceBinding;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DeviceBinding.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DeviceBinding.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DeviceBinding.prototype, "deviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DeviceBinding.prototype, "deviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], DeviceBinding.prototype, "boundAt", void 0);
exports.DeviceBinding = DeviceBinding = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, toJSON: { virtuals: true, transform: (_doc, ret) => { delete ret._id; } } })
], DeviceBinding);
exports.DeviceBindingSchema = mongoose_1.SchemaFactory.createForClass(DeviceBinding);
exports.DeviceBindingSchema.index({ tenantId: 1, userId: 1 });
//# sourceMappingURL=device-binding.schema.js.map