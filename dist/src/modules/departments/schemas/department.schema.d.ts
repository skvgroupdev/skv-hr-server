import { HydratedDocument, Types } from 'mongoose';
export type DepartmentDocument = HydratedDocument<Department>;
export declare class Department {
    tenantId: Types.ObjectId;
    name: string;
    description?: string;
    headId: Types.ObjectId | null;
    isActive: boolean;
}
export declare const DepartmentSchema: import("mongoose").Schema<Department, import("mongoose").Model<Department, any, any, any, any, any, Department>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Department, import("mongoose").Document<unknown, {}, Department, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Department & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Department, import("mongoose").Document<unknown, {}, Department, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Department, import("mongoose").Document<unknown, {}, Department, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, Department, import("mongoose").Document<unknown, {}, Department, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    headId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, Department, import("mongoose").Document<unknown, {}, Department, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Department, import("mongoose").Document<unknown, {}, Department, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Department>;
