import { HydratedDocument, Types } from 'mongoose';
export type PayrollPeriodDocument = HydratedDocument<PayrollPeriod>;
export declare class PayrollPeriod {
    tenantId: Types.ObjectId;
    name: string;
    startDate: Date;
    endDate: Date;
    status: 'DRAFT' | 'GENERATED' | 'HR_REVIEWED' | 'PAID' | 'APPROVED' | 'LOCKED';
    generatedBy?: Types.ObjectId;
    approvedBy?: Types.ObjectId;
    hrReviewedBy?: Types.ObjectId;
    hrReviewedAt?: Date;
    paidBy?: Types.ObjectId;
    paidAt?: Date;
    lockedBy?: Types.ObjectId;
}
export declare const PayrollPeriodSchema: import("mongoose").Schema<PayrollPeriod, import("mongoose").Model<PayrollPeriod, any, any, any, any, any, PayrollPeriod>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"APPROVED" | "DRAFT" | "GENERATED" | "HR_REVIEWED" | "PAID" | "LOCKED", PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    generatedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    approvedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    hrReviewedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    hrReviewedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paidBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paidAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lockedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, PayrollPeriod, import("mongoose").Document<unknown, {}, PayrollPeriod, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollPeriod & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PayrollPeriod>;
