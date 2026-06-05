import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectModel(Notification.name) private readonly model: Model<NotificationDocument>,
  ) {}

  create(data: {
    tenantId: Types.ObjectId;
    receiverId: Types.ObjectId;
    title: string;
    body: string;
    type: NotificationType;
    data?: Record<string, unknown>;
  }): Promise<NotificationDocument> {
    return this.model.create(data);
  }

  async findByReceiver(receiverId: Types.ObjectId, page: number, limit: number, isRead?: boolean) {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = { receiverId };
    if (isRead !== undefined) filter.isRead = isRead;

    const [items, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return { items, total };
  }

  countUnread(receiverId: Types.ObjectId): Promise<number> {
    return this.model.countDocuments({ receiverId, isRead: false }).exec();
  }

  markAsRead(id: string, receiverId: Types.ObjectId): Promise<NotificationDocument | null> {
    return this.model.findOneAndUpdate(
      { _id: id, receiverId },
      { isRead: true, readAt: new Date() },
      { returnDocument: 'after' },
    ).exec();
  }

  markAllAsRead(receiverId: Types.ObjectId): Promise<void> {
    return this.model.updateMany(
      { receiverId, isRead: false },
      { isRead: true, readAt: new Date() },
    ).exec().then(() => undefined);
  }
}
