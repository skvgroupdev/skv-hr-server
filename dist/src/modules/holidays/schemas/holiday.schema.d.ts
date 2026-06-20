import { HydratedDocument, Types } from 'mongoose';
export type HolidayDocument = HydratedDocument<Holiday>;
export declare class Holiday {
    tenantId: Types.ObjectId;
    name: string;
    date: Date;
    type: 'PUBLIC' | 'COMPANY';
    isActive: boolean;
}
export declare const HolidaySchema: import("mongoose").Schema<Holiday, import("mongoose").Model<Holiday, any, any, any, any, any, Holiday>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Holiday, import("mongoose").Document<unknown, {}, Holiday, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Holiday & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Holiday, import("mongoose").Document<unknown, {}, Holiday, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Holiday & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Holiday, import("mongoose").Document<unknown, {}, Holiday, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Holiday & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, Holiday, import("mongoose").Document<unknown, {}, Holiday, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Holiday & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<"PUBLIC" | "COMPANY", Holiday, import("mongoose").Document<unknown, {}, Holiday, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Holiday & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Holiday, import("mongoose").Document<unknown, {}, Holiday, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Holiday & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Holiday>;
