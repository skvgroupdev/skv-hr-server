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
exports.HolidaySchema = exports.Holiday = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Holiday = class Holiday {
    tenantId;
    name;
    date;
    type;
    isActive;
};
exports.Holiday = Holiday;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Holiday.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Holiday.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Holiday.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['PUBLIC', 'COMPANY'], required: true }),
    __metadata("design:type", String)
], Holiday.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Holiday.prototype, "isActive", void 0);
exports.Holiday = Holiday = __decorate([
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
], Holiday);
exports.HolidaySchema = mongoose_1.SchemaFactory.createForClass(Holiday);
exports.HolidaySchema.index({ tenantId: 1, date: 1 });
//# sourceMappingURL=holiday.schema.js.map