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
exports.BranchSchema = exports.Branch = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Branch = class Branch {
    tenantId;
    name;
    code;
    address;
    location;
    radiusMeters;
    phone;
    managerId;
    isActive;
    workingPolicy;
};
exports.Branch = Branch;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Branch.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Branch.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Branch.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Branch.prototype, "address", void 0);
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
], Branch.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 100 }),
    __metadata("design:type", Number)
], Branch.prototype, "radiusMeters", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Branch.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", Object)
], Branch.prototype, "managerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Branch.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Branch.prototype, "workingPolicy", void 0);
exports.Branch = Branch = __decorate([
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
], Branch);
exports.BranchSchema = mongoose_1.SchemaFactory.createForClass(Branch);
exports.BranchSchema.index({ tenantId: 1 });
exports.BranchSchema.index({ location: '2dsphere' }, { sparse: true });
//# sourceMappingURL=branch.schema.js.map