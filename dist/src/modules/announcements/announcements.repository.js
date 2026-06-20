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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const announcement_schema_1 = require("./schemas/announcement.schema");
const MAX_LIMIT = 100;
let AnnouncementsRepository = class AnnouncementsRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return this.model.create(data);
    }
    findById(id, tenantId) {
        return this.model.findOne({ _id: id, tenantId }).exec();
    }
    async findAll(tenantId, page, limit) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.model.find({ tenantId }).sort({ isPinned: -1, createdAt: -1 }).skip(skip).limit(limit).exec(),
            this.model.countDocuments({ tenantId }).exec(),
        ]);
        return { items, total };
    }
    async findPublishedFeed(tenantId, page, limit) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.model
                .find({ tenantId, status: 'PUBLISHED' })
                .sort({ isPinned: -1, publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.model.countDocuments({ tenantId, status: 'PUBLISHED' }).exec(),
        ]);
        return { items, total };
    }
    update(id, tenantId, data) {
        return this.model.findOneAndUpdate({ _id: id, tenantId }, data, { returnDocument: 'after' }).exec();
    }
    softDelete(id, tenantId) {
        return this.model.findOneAndDelete({ _id: id, tenantId }).exec();
    }
    markRead(id, userId) {
        return this.model.findByIdAndUpdate(id, { $addToSet: { readBy: userId } }, { returnDocument: 'after' }).exec();
    }
};
exports.AnnouncementsRepository = AnnouncementsRepository;
exports.AnnouncementsRepository = AnnouncementsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(announcement_schema_1.Announcement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AnnouncementsRepository);
//# sourceMappingURL=announcements.repository.js.map