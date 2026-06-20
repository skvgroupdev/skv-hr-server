import { HydratedDocument, Types } from 'mongoose';
export type AttendanceLogDocument = HydratedDocument<AttendanceLog>;
export type AttendanceType = 'CHECK_IN' | 'CHECK_OUT' | 'BREAK_IN' | 'BREAK_OUT' | 'MANUAL_ADJUSTMENT';
export type AttendanceStatus = 'NORMAL' | 'LATE_MINOR' | 'LATE' | 'EARLY_LEAVE' | 'ABSENT' | 'MISSING_CHECKOUT' | 'OUTSIDE_PENDING' | 'OUTSIDE_APPROVED' | 'OUTSIDE_REJECTED' | 'MANUAL_ADJUSTED';
export declare class AttendanceLog {
    tenantId: Types.ObjectId;
    employeeId: Types.ObjectId;
    branchId?: Types.ObjectId;
    type: AttendanceType;
    checkTime: Date;
    serverTime: Date;
    location?: {
        type: 'Point';
        coordinates: [number, number];
    };
    gpsAccuracy?: number;
    distanceFromBranch?: number;
    isInsideGeofence?: boolean;
    selfieUrl?: string;
    deviceId?: string;
    ipAddress?: string;
    status: AttendanceStatus;
    lateMinutes: number;
    note?: string;
    adjustedBy?: Types.ObjectId;
    adjustReason?: string;
    earlyLeaveReason?: string;
    scheduleSnapshot?: Record<string, unknown>;
    correctionFor?: Types.ObjectId;
}
export declare const AttendanceLogSchema: import("mongoose").Schema<AttendanceLog, import("mongoose").Model<AttendanceLog, any, any, any, any, any, AttendanceLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    branchId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<AttendanceType, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    checkTime?: import("mongoose").SchemaDefinitionProperty<Date, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    serverTime?: import("mongoose").SchemaDefinitionProperty<Date, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<{
        type: "Point";
        coordinates: [number, number];
    } | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gpsAccuracy?: import("mongoose").SchemaDefinitionProperty<number | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    distanceFromBranch?: import("mongoose").SchemaDefinitionProperty<number | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isInsideGeofence?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    selfieUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deviceId?: import("mongoose").SchemaDefinitionProperty<string | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ipAddress?: import("mongoose").SchemaDefinitionProperty<string | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<AttendanceStatus, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lateMinutes?: import("mongoose").SchemaDefinitionProperty<number, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    adjustedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    adjustReason?: import("mongoose").SchemaDefinitionProperty<string | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    earlyLeaveReason?: import("mongoose").SchemaDefinitionProperty<string | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scheduleSnapshot?: import("mongoose").SchemaDefinitionProperty<Record<string, unknown> | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    correctionFor?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, AttendanceLog, import("mongoose").Document<unknown, {}, AttendanceLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AttendanceLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, AttendanceLog>;
