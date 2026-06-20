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
exports.CompanySchema = exports.Company = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Company = class Company {
    name;
    companyCode;
    logo;
    taxId;
    address;
    phone;
    email;
    defaultLanguage;
    defaultTimezone;
    status;
    planId;
    subscription;
};
exports.Company = Company;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, uppercase: true }),
    __metadata("design:type", String)
], Company.prototype, "companyCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Company.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Company.prototype, "taxId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Company.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Company.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Company.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'th' }),
    __metadata("design:type", String)
], Company.prototype, "defaultLanguage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Asia/Vientiane' }),
    __metadata("design:type", String)
], Company.prototype, "defaultTimezone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['ACTIVE', 'SUSPENDED', 'TRIAL', 'EXPIRED'],
        default: 'TRIAL',
    }),
    __metadata("design:type", String)
], Company.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Plan', default: null }),
    __metadata("design:type", Object)
], Company.prototype, "planId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            startDate: Date,
            endDate: Date,
            status: {
                type: String,
                enum: ['TRIAL', 'ACTIVE', 'PAST_DUE', 'EXPIRED', 'CANCELLED', 'SUSPENDED'],
                default: 'TRIAL',
            },
            isPaid: { type: Boolean, default: false },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], Company.prototype, "subscription", void 0);
exports.Company = Company = __decorate([
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
], Company);
exports.CompanySchema = mongoose_1.SchemaFactory.createForClass(Company);
//# sourceMappingURL=company.schema.js.map