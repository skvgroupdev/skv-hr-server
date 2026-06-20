import { HydratedDocument, Types } from 'mongoose';
export type OTRequestDocument = HydratedDocument<OTRequest>;
export declare class OTRequest {
    tenantId: Types.ObjectId;
    employeeId: Types.ObjectId;
    date: Date;
    startTime: Date;
    endTime: Date;
    totalHours: number;
    dayType?: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    approvalFlow: Array<{
        approverId: Types.ObjectId;
        role: string;
        status: string;
        comment?: string;
        approvedAt?: Date;
    }>;
}
export declare const OTRequestSchema: import("mongoose").Schema<OTRequest, import("mongoose").Model<OTRequest, any, any, any, any, any, OTRequest>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OTRequest, import("mongoose").Document<unknown, {}, OTRequest, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<OTRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OTRequest, import("mongoose").Document<unknown, {}, OTRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OTRequest, import("mongoose").Document<unknown, {}, OTRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, OTRequest, import("mongoose").Document<unknown, {}, OTRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startTime?: import("mongoose").SchemaDefinitionProperty<Date, OTRequest, import("mongoose").Document<unknown, {}, OTRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endTime?: import("mongoose").SchemaDefinitionProperty<Date, OTRequest, import("mongoose").Document<unknown, {}, OTRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalHours?: import("mongoose").SchemaDefinitionProperty<number, OTRequest, import("mongoose").Document<unknown, {}, OTRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dayType?: import("mongoose").SchemaDefinitionProperty<string | undefined, OTRequest, import("mongoose").Document<unknown, {}, OTRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, OTRequest, import("mongoose").Document<unknown, {}, OTRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"CANCELLED" | "PENDING" | "APPROVED" | "REJECTED", OTRequest, import("mongoose").Document<unknown, {}, OTRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    approvalFlow?: import("mongoose").SchemaDefinitionProperty<{
        approverId: Types.ObjectId;
        role: string;
        status: string;
        comment?: string;
        approvedAt?: Date;
    }[], OTRequest, import("mongoose").Document<unknown, {}, OTRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, OTRequest>;
