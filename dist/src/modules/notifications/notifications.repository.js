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
exports.NotificationsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("./schemas/notification.schema");
let NotificationsRepository = class NotificationsRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return this.model.create(data);
    }
    async findByReceiver(receiverId, page, limit, isRead) {
        const skip = (page - 1) * limit;
        const filter = { receiverId };
        if (isRead !== undefined)
            filter.isRead = isRead;
        const [items, total] = await Promise.all([
            this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            this.model.countDocuments(filter).exec(),
        ]);
        return { items, total };
    }
    countUnread(receiverId) {
        return this.model.countDocuments({ receiverId, isRead: false }).exec();
    }
    markAsRead(id, receiverId) {
        return this.model.findOneAndUpdate({ _id: id, receiverId }, { isRead: true, readAt: new Date() }, { returnDocument: 'after' }).exec();
    }
    markAllAsRead(receiverId) {
        return this.model.updateMany({ receiverId, isRead: false }, { isRead: true, readAt: new Date() }).exec().then(() => undefined);
    }
};
exports.NotificationsRepository = NotificationsRepository;
exports.NotificationsRepository = NotificationsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationsRepository);
//# sourceMappingURL=notifications.repository.js.map