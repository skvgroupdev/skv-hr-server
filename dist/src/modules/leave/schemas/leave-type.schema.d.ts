import { HydratedDocument, Types } from 'mongoose';
export type LeaveTypeDocument = HydratedDocument<LeaveType>;
export declare class LeaveType {
    tenantId: Types.ObjectId;
    name: string;
    code: string;
    defaultDaysPerYear: number;
    isPaid: boolean;
    category: 'LEAVE' | 'REST_DAY';
    requireAttachment: boolean;
    isActive: boolean;
}
export declare const LeaveTypeSchema: import("mongoose").Schema<LeaveType, import("mongoose").Model<LeaveType, any, any, any, any, any, LeaveType>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LeaveType, import("mongoose").Document<unknown, {}, LeaveType, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<LeaveType & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, LeaveType, import("mongoose").Document<unknown, {}, LeaveType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, LeaveType, import("mongoose").Document<unknown, {}, LeaveType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    code?: import("mongoose").SchemaDefinitionProperty<string, LeaveType, import("mongoose").Document<unknown, {}, LeaveType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    defaultDaysPerYear?: import("mongoose").SchemaDefinitionProperty<number, LeaveType, import("mongoose").Document<unknown, {}, LeaveType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isPaid?: import("mongoose").SchemaDefinitionProperty<boolean, LeaveType, import("mongoose").Document<unknown, {}, LeaveType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<"LEAVE" | "REST_DAY", LeaveType, import("mongoose").Document<unknown, {}, LeaveType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    requireAttachment?: import("mongoose").SchemaDefinitionProperty<boolean, LeaveType, import("mongoose").Document<unknown, {}, LeaveType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, LeaveType, import("mongoose").Document<unknown, {}, LeaveType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, LeaveType>;
