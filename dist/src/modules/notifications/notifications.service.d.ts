import { Types } from 'mongoose';
import { NotificationsRepository } from './notifications.repository';
import { NotificationType } from './schemas/notification.schema';
import { NotificationQueryDto } from './dto/notification-query.dto';
export interface NotifyPayload {
    title: string;
    body: string;
    type: NotificationType;
    tenantId: string | Types.ObjectId;
    data?: Record<string, unknown>;
}
export declare class NotificationsService {
    private readonly notificationsRepository;
    constructor(notificationsRepository: NotificationsRepository);
    notify(receiverId: string | Types.ObjectId, payload: NotifyPayload): Promise<void>;
    getMyNotifications(userId: string, query: NotificationQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/notification.schema").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/notification.schema").Notification & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/notification.schema").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/notification.schema").Notification & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    markAsRead(userId: string, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/notification.schema").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/notification.schema").Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
}
