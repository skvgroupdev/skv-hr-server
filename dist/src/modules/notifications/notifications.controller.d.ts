import { NotificationsService } from './notifications.service';
import { NotificationQueryDto } from './dto/notification-query.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(query: NotificationQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/notification.schema").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/notification.schema").Notification & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/notification.schema").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/notification.schema").Notification & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUnreadCount(user: JwtPayload): Promise<{
        data: {
            count: number;
        };
    }>;
    markAsRead(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/notification.schema").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/notification.schema").Notification & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    markAllAsRead(user: JwtPayload): Promise<{
        message: string;
    }>;
}
