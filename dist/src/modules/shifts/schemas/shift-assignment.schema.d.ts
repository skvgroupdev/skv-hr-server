import { HydratedDocument, Types } from 'mongoose';
export type ShiftAssignmentDocument = HydratedDocument<ShiftAssignment>;
export declare class ShiftAssignment {
    tenantId: Types.ObjectId;
    employeeId: Types.ObjectId;
    shiftId: Types.ObjectId;
    effectiveDate: Date;
    endDate?: Date;
}
export declare const ShiftAssignmentSchema: import("mongoose").Schema<ShiftAssignment, import("mongoose").Model<ShiftAssignment, any, any, any, any, any, ShiftAssignment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ShiftAssignment, import("mongoose").Document<unknown, {}, ShiftAssignment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ShiftAssignment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ShiftAssignment, import("mongoose").Document<unknown, {}, ShiftAssignment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ShiftAssignment, import("mongoose").Document<unknown, {}, ShiftAssignment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    shiftId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ShiftAssignment, import("mongoose").Document<unknown, {}, ShiftAssignment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    effectiveDate?: import("mongoose").SchemaDefinitionProperty<Date, ShiftAssignment, import("mongoose").Document<unknown, {}, ShiftAssignment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ShiftAssignment, import("mongoose").Document<unknown, {}, ShiftAssignment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ShiftAssignment>;
