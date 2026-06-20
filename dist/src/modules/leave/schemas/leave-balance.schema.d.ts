import { HydratedDocument, Types } from 'mongoose';
export type LeaveBalanceDocument = HydratedDocument<LeaveBalance>;
export declare class LeaveBalance {
    tenantId: Types.ObjectId;
    employeeId: Types.ObjectId;
    leaveTypeId: Types.ObjectId;
    year: number;
    totalDays: number;
    usedDays: number;
    remainingDays: number;
}
export declare const LeaveBalanceSchema: import("mongoose").Schema<LeaveBalance, import("mongoose").Model<LeaveBalance, any, any, any, any, any, LeaveBalance>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LeaveBalance, import("mongoose").Document<unknown, {}, LeaveBalance, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<LeaveBalance & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, LeaveBalance, import("mongoose").Document<unknown, {}, LeaveBalance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveBalance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, LeaveBalance, import("mongoose").Document<unknown, {}, LeaveBalance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveBalance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    leaveTypeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, LeaveBalance, import("mongoose").Document<unknown, {}, LeaveBalance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveBalance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    year?: import("mongoose").SchemaDefinitionProperty<number, LeaveBalance, import("mongoose").Document<unknown, {}, LeaveBalance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveBalance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalDays?: import("mongoose").SchemaDefinitionProperty<number, LeaveBalance, import("mongoose").Document<unknown, {}, LeaveBalance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveBalance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    usedDays?: import("mongoose").SchemaDefinitionProperty<number, LeaveBalance, import("mongoose").Document<unknown, {}, LeaveBalance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveBalance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    remainingDays?: import("mongoose").SchemaDefinitionProperty<number, LeaveBalance, import("mongoose").Document<unknown, {}, LeaveBalance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveBalance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, LeaveBalance>;
