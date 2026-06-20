import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';
export declare class NotificationsRepository {
    private readonly model;
    constructor(model: Model<NotificationDocument>);
    create(data: {
        tenantId: Types.ObjectId;
        receiverId: Types.ObjectId;
        title: string;
        body: string;
        type: NotificationType;
        data?: Record<string, unknown>;
    }): Promise<NotificationDocument>;
    findByReceiver(receiverId: Types.ObjectId, page: number, limit: number, isRead?: boolean): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        total: number;
    }>;
    countUnread(receiverId: Types.ObjectId): Promise<number>;
    markAsRead(id: string, receiverId: Types.ObjectId): Promise<NotificationDocument | null>;
    markAllAsRead(receiverId: Types.ObjectId): Promise<void>;
}
