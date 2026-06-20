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
exports.AnnouncementSchema = exports.Announcement = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Announcement = class Announcement {
    tenantId;
    title;
    content;
    targetType;
    targetIds;
    isPinned;
    publishedAt;
    status;
    createdBy;
    readBy;
};
exports.Announcement = Announcement;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Announcement.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Announcement.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Announcement.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['ALL', 'BRANCH', 'DEPARTMENT', 'ROLE'], default: 'ALL' }),
    __metadata("design:type", String)
], Announcement.prototype, "targetType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], default: [] }),
    __metadata("design:type", Array)
], Announcement.prototype, "targetIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Announcement.prototype, "isPinned", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Announcement.prototype, "publishedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' }),
    __metadata("design:type", String)
], Announcement.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Announcement.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'User' }], default: [] }),
    __metadata("design:type", Array)
], Announcement.prototype, "readBy", void 0);
exports.Announcement = Announcement = __decorate([
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
], Announcement);
exports.AnnouncementSchema = mongoose_1.SchemaFactory.createForClass(Announcement);
exports.AnnouncementSchema.index({ tenantId: 1, status: 1 });
exports.AnnouncementSchema.index({ tenantId: 1, isPinned: 1 });
//# sourceMappingURL=announcement.schema.js.map