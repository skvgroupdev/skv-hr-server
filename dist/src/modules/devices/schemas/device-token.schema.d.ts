import { HydratedDocument, Types } from 'mongoose';
export type DeviceTokenDocument = HydratedDocument<DeviceToken>;
export declare class DeviceToken {
    tenantId: Types.ObjectId;
    userId: Types.ObjectId;
    token: string;
    platform: 'ios' | 'android' | 'web';
}
export declare const DeviceTokenSchema: import("mongoose").Schema<DeviceToken, import("mongoose").Model<DeviceToken, any, any, any, any, any, DeviceToken>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DeviceToken, import("mongoose").Document<unknown, {}, DeviceToken, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<DeviceToken & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DeviceToken, import("mongoose").Document<unknown, {}, DeviceToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DeviceToken & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DeviceToken, import("mongoose").Document<unknown, {}, DeviceToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DeviceToken & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    token?: import("mongoose").SchemaDefinitionProperty<string, DeviceToken, import("mongoose").Document<unknown, {}, DeviceToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DeviceToken & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    platform?: import("mongoose").SchemaDefinitionProperty<"ios" | "android" | "web", DeviceToken, import("mongoose").Document<unknown, {}, DeviceToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DeviceToken & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, DeviceToken>;
