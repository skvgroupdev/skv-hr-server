import { HydratedDocument, Types } from 'mongoose';
export type NotificationDocument = HydratedDocument<Notification>;
export type NotificationType = 'LEAVE_REQUEST' | 'LEAVE_APPROVED' | 'LEAVE_REJECTED' | 'OT_REQUEST' | 'OT_APPROVED' | 'OT_REJECTED' | 'OUTSIDE_WORK_REQUEST' | 'OUTSIDE_WORK_APPROVED' | 'OUTSIDE_WORK_REJECTED' | 'ATTENDANCE_LATE' | 'PAYROLL_RELEASED' | 'ANNOUNCEMENT' | 'SUBSCRIPTION_EXPIRING';
export declare class Notification {
    tenantId: Types.ObjectId;
    receiverId: Types.ObjectId;
    title: string;
    body: string;
    type: NotificationType;
    data?: Record<string, unknown>;
    isRead: boolean;
    readAt?: Date;
}
export declare const NotificationSchema: import("mongoose").Schema<Notification, import("mongoose").Model<Notification, any, any, any, any, any, Notification>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, import("mongoose").Document<unknown, {}, Notification, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Notification, import("mongoose").Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    receiverId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Notification, import("mongoose").Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Notification, import("mongoose").Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    body?: import("mongoose").SchemaDefinitionProperty<string, Notification, import("mongoose").Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<NotificationType, Notification, import("mongoose").Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    data?: import("mongoose").SchemaDefinitionProperty<Record<string, unknown> | undefined, Notification, import("mongoose").Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isRead?: import("mongoose").SchemaDefinitionProperty<boolean, Notification, import("mongoose").Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    readAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Notification, import("mongoose").Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Notification>;
