import { HydratedDocument, Types } from 'mongoose';
export type BranchDocument = HydratedDocument<Branch>;
export declare class Branch {
    tenantId: Types.ObjectId;
    name: string;
    code?: string;
    address?: string;
    location?: {
        type: 'Point';
        coordinates: [number, number];
    };
    radiusMeters: number;
    phone?: string;
    managerId: Types.ObjectId | null;
    isActive: boolean;
    workingPolicy?: string;
}
export declare const BranchSchema: import("mongoose").Schema<Branch, import("mongoose").Model<Branch, any, any, any, any, any, Branch>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Branch, import("mongoose").Document<unknown, {}, Branch, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Branch, import("mongoose").Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Branch, import("mongoose").Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    code?: import("mongoose").SchemaDefinitionProperty<string | undefined, Branch, import("mongoose").Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string | undefined, Branch, import("mongoose").Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<{
        type: "Point";
        coordinates: [number, number];
    } | undefined, Branch, import("mongoose").Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    radiusMeters?: import("mongoose").SchemaDefinitionProperty<number, Branch, import("mongoose").Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string | undefined, Branch, import("mongoose").Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    managerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, Branch, import("mongoose").Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Branch, import("mongoose").Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    workingPolicy?: import("mongoose").SchemaDefinitionProperty<string | undefined, Branch, import("mongoose").Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Branch>;
