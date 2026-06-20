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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const notifications_repository_1 = require("./notifications.repository");
const MAX_LIMIT = 100;
let NotificationsService = class NotificationsService {
    notificationsRepository;
    constructor(notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }
    async notify(receiverId, payload) {
        const receiverObjectId = typeof receiverId === 'string' ? new mongoose_1.Types.ObjectId(receiverId) : receiverId;
        const tenantObjectId = typeof payload.tenantId === 'string' ? new mongoose_1.Types.ObjectId(payload.tenantId) : payload.tenantId;
        await this.notificationsRepository.create({
            tenantId: tenantObjectId,
            receiverId: receiverObjectId,
            title: payload.title,
            body: payload.body,
            type: payload.type,
            data: payload.data,
        });
        console.log(`[FCM TODO] Notify user ${receiverObjectId}: ${payload.title}`);
    }
    async getMyNotifications(userId, query) {
        const receiverId = new mongoose_1.Types.ObjectId(userId);
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const { items, total } = await this.notificationsRepository.findByReceiver(receiverId, page, limit, query.isRead);
        return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getUnreadCount(userId) {
        const count = await this.notificationsRepository.countUnread(new mongoose_1.Types.ObjectId(userId));
        return { count };
    }
    async markAsRead(userId, id) {
        return this.notificationsRepository.markAsRead(id, new mongoose_1.Types.ObjectId(userId));
    }
    async markAllAsRead(userId) {
        await this.notificationsRepository.markAllAsRead(new mongoose_1.Types.ObjectId(userId));
        return { message: 'All notifications marked as read' };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_repository_1.NotificationsRepository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map