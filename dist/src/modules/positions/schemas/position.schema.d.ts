import { HydratedDocument, Types } from 'mongoose';
export type PositionDocument = HydratedDocument<Position>;
export declare class Position {
    tenantId: Types.ObjectId;
    name: string;
    level?: number;
    description?: string;
    banding?: string;
    isActive: boolean;
}
export declare const PositionSchema: import("mongoose").Schema<Position, import("mongoose").Model<Position, any, any, any, any, any, Position>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Position, import("mongoose").Document<unknown, {}, Position, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Position & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Position, import("mongoose").Document<unknown, {}, Position, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Position, import("mongoose").Document<unknown, {}, Position, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    level?: import("mongoose").SchemaDefinitionProperty<number | undefined, Position, import("mongoose").Document<unknown, {}, Position, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, Position, import("mongoose").Document<unknown, {}, Position, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    banding?: import("mongoose").SchemaDefinitionProperty<string | undefined, Position, import("mongoose").Document<unknown, {}, Position, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Position, import("mongoose").Document<unknown, {}, Position, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Position>;
