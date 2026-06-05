import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationsRepository } from './notifications.repository';
import { NotificationType } from './schemas/notification.schema';
import { NotificationQueryDto } from './dto/notification-query.dto';

const MAX_LIMIT = 100;

export interface NotifyPayload {
  title: string;
  body: string;
  type: NotificationType;
  tenantId: string | Types.ObjectId;
  data?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async notify(receiverId: string | Types.ObjectId, payload: NotifyPayload): Promise<void> {
    const receiverObjectId =
      typeof receiverId === 'string' ? new Types.ObjectId(receiverId) : receiverId;
    const tenantObjectId =
      typeof payload.tenantId === 'string' ? new Types.ObjectId(payload.tenantId) : payload.tenantId;

    await this.notificationsRepository.create({
      tenantId: tenantObjectId,
      receiverId: receiverObjectId,
      title: payload.title,
      body: payload.body,
      type: payload.type,
      data: payload.data,
    });

    // FCM integration placeholder — log in production, replace with real FCM call
    console.log(`[FCM TODO] Notify user ${receiverObjectId}: ${payload.title}`);
  }

  async getMyNotifications(userId: string, query: NotificationQueryDto) {
    const receiverId = new Types.ObjectId(userId);
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));

    const { items, total } = await this.notificationsRepository.findByReceiver(
      receiverId,
      page,
      limit,
      query.isRead,
    );

    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationsRepository.countUnread(new Types.ObjectId(userId));
    return { count };
  }

  async markAsRead(userId: string, id: string) {
    return this.notificationsRepository.markAsRead(id, new Types.ObjectId(userId));
  }

  async markAllAsRead(userId: string) {
    await this.notificationsRepository.markAllAsRead(new Types.ObjectId(userId));
    return { message: 'All notifications marked as read' };
  }
}
