import { HydratedDocument, Types } from 'mongoose';
export type DeviceBindingDocument = HydratedDocument<DeviceBinding>;
export declare class DeviceBinding {
    tenantId: Types.ObjectId;
    userId: Types.ObjectId;
    deviceId: string;
    deviceName?: string;
    boundAt: Date;
}
export declare const DeviceBindingSchema: import("mongoose").Schema<DeviceBinding, import("mongoose").Model<DeviceBinding, any, any, any, any, any, DeviceBinding>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DeviceBinding, import("mongoose").Document<unknown, {}, DeviceBinding, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<DeviceBinding & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DeviceBinding, import("mongoose").Document<unknown, {}, DeviceBinding, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DeviceBinding & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DeviceBinding, import("mongoose").Document<unknown, {}, DeviceBinding, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DeviceBinding & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deviceId?: import("mongoose").SchemaDefinitionProperty<string, DeviceBinding, import("mongoose").Document<unknown, {}, DeviceBinding, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DeviceBinding & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deviceName?: import("mongoose").SchemaDefinitionProperty<string | undefined, DeviceBinding, import("mongoose").Document<unknown, {}, DeviceBinding, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DeviceBinding & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    boundAt?: import("mongoose").SchemaDefinitionProperty<Date, DeviceBinding, import("mongoose").Document<unknown, {}, DeviceBinding, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DeviceBinding & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, DeviceBinding>;
