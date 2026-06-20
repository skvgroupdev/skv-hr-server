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
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const announcements_repository_1 = require("./announcements.repository");
const notifications_service_1 = require("../notifications/notifications.service");
const MAX_LIMIT = 100;
let AnnouncementsService = class AnnouncementsService {
    announcementsRepository;
    notificationsService;
    constructor(announcementsRepository, notificationsService) {
        this.announcementsRepository = announcementsRepository;
        this.notificationsService = notificationsService;
    }
    async create(tenantId, userId, dto) {
        return this.announcementsRepository.create({
            tenantId: new mongoose_1.Types.ObjectId(tenantId),
            createdBy: new mongoose_1.Types.ObjectId(userId),
            title: dto.title,
            content: dto.content,
            targetType: dto.targetType ?? 'ALL',
            targetIds: dto.targetIds?.map((id) => new mongoose_1.Types.ObjectId(id)) ?? [],
            isPinned: dto.isPinned ?? false,
        });
    }
    async findAll(tenantId, page = 1, limit = 20) {
        const safeLimit = Math.min(MAX_LIMIT, limit);
        const { items, total } = await this.announcementsRepository.findAll(new mongoose_1.Types.ObjectId(tenantId), page, safeLimit);
        return { data: items, meta: { page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
    }
    async findOne(tenantId, id) {
        const item = await this.announcementsRepository.findById(id, new mongoose_1.Types.ObjectId(tenantId));
        if (!item)
            throw new common_1.NotFoundException('Announcement not found');
        return item;
    }
    async update(tenantId, id, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.announcementsRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Announcement not found');
        const updateData = {
            ...dto,
            targetIds: dto.targetIds?.map((id) => new mongoose_1.Types.ObjectId(id)) ?? undefined,
        };
        return this.announcementsRepository.update(id, tenantObjectId, updateData);
    }
    async delete(tenantId, id) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.announcementsRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Announcement not found');
        return this.announcementsRepository.softDelete(id, tenantObjectId);
    }
    async publish(tenantId, id) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.announcementsRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Announcement not found');
        return this.announcementsRepository.update(id, tenantObjectId, {
            status: 'PUBLISHED',
            publishedAt: new Date(),
        });
    }
    async getMobileFeed(tenantId, page = 1, limit = 20) {
        const safeLimit = Math.min(MAX_LIMIT, limit);
        const { items, total } = await this.announcementsRepository.findPublishedFeed(new mongoose_1.Types.ObjectId(tenantId), page, safeLimit);
        return { data: items, meta: { page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
    }
    async markRead(id, userId) {
        return this.announcementsRepository.markRead(id, new mongoose_1.Types.ObjectId(userId));
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [announcements_repository_1.AnnouncementsRepository,
        notifications_service_1.NotificationsService])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map