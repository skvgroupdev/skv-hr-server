import { HydratedDocument, Types } from 'mongoose';
export type OutsideWorkDocument = HydratedDocument<OutsideWork>;
export declare class OutsideWork {
    tenantId: Types.ObjectId;
    employeeId: Types.ObjectId;
    managerId?: Types.ObjectId;
    attendanceLogId?: Types.ObjectId;
    outsideType: string;
    reason: string;
    locationName?: string;
    location?: {
        type: 'Point';
        coordinates: [number, number];
    };
    gpsAccuracy?: number;
    photoUrls: string[];
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    rejectedBy?: Types.ObjectId;
    rejectedAt?: Date;
    rejectReason?: string;
}
export declare const OutsideWorkSchema: import("mongoose").Schema<OutsideWork, import("mongoose").Model<OutsideWork, any, any, any, any, any, OutsideWork>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    managerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    attendanceLogId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    outsideType?: import("mongoose").SchemaDefinitionProperty<string, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    locationName?: import("mongoose").SchemaDefinitionProperty<string | undefined, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<{
        type: "Point";
        coordinates: [number, number];
    } | undefined, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gpsAccuracy?: import("mongoose").SchemaDefinitionProperty<number | undefined, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    photoUrls?: import("mongoose").SchemaDefinitionProperty<string[], OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"PENDING" | "APPROVED" | "REJECTED", OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    approvedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    approvedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rejectedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rejectedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rejectReason?: import("mongoose").SchemaDefinitionProperty<string | undefined, OutsideWork, import("mongoose").Document<unknown, {}, OutsideWork, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, OutsideWork>;
