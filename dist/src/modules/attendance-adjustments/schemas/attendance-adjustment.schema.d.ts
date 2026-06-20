import { HydratedDocument, Types } from 'mongoose';
export type AttendanceAdjustmentDocument = HydratedDocument<AttendanceAdjustment>;
export declare class AttendanceAdjustment {
    tenantId: Types.ObjectId;
    employeeId: Types.ObjectId;
    branchId: Types.ObjectId;
    attendanceLogId?: Types.ObjectId;
    correctionLogId?: Types.ObjectId;
    type: 'CHECK_IN' | 'CHECK_OUT';
    workDate: Date;
    originalCheckTime?: Date;
    requestedCheckTime: Date;
    reason: string;
    evidenceUrl?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    reviewedBy?: Types.ObjectId;
    reviewComment?: string;
    reviewedAt?: Date;
}
export declare const AttendanceAdjustmentSchema: import("mongoose").Schema<AttendanceAdjustment, import("mongoose").Model<AttendanceAdjustment, any, any, any, any, any, AttendanceAdjustment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    branchId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    attendanceLogId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    correctionLogId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<"CHECK_IN" | "CHECK_OUT", AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    workDate?: import("mongoose").SchemaDefinitionProperty<Date, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    originalCheckTime?: import("mongoose").SchemaDefinitionProperty<Date | undefined, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    requestedCheckTime?: import("mongoose").SchemaDefinitionProperty<Date, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    evidenceUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"CANCELLED" | "PENDING" | "APPROVED" | "REJECTED", AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reviewedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reviewComment?: import("mongoose").SchemaDefinitionProperty<string | undefined, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reviewedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, AttendanceAdjustment, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, AttendanceAdjustment>;
