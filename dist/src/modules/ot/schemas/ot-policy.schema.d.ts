import { HydratedDocument, Types } from 'mongoose';
export type OTPolicyDocument = HydratedDocument<OTPolicy>;
export declare class OTPolicy {
    tenantId: Types.ObjectId;
    weekdayRate: number;
    weekendRate: number;
    holidayRate: number;
    beforeWorkAllowed: boolean;
    afterWorkAllowed: boolean;
    minOtMinutes: number;
    maxOtHoursPerDay: number;
    requirePreApproval: boolean;
    compareWithCheckout: boolean;
}
export declare const OTPolicySchema: import("mongoose").Schema<OTPolicy, import("mongoose").Model<OTPolicy, any, any, any, any, any, OTPolicy>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OTPolicy, import("mongoose").Document<unknown, {}, OTPolicy, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<OTPolicy & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OTPolicy, import("mongoose").Document<unknown, {}, OTPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weekdayRate?: import("mongoose").SchemaDefinitionProperty<number, OTPolicy, import("mongoose").Document<unknown, {}, OTPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weekendRate?: import("mongoose").SchemaDefinitionProperty<number, OTPolicy, import("mongoose").Document<unknown, {}, OTPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    holidayRate?: import("mongoose").SchemaDefinitionProperty<number, OTPolicy, import("mongoose").Document<unknown, {}, OTPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    beforeWorkAllowed?: import("mongoose").SchemaDefinitionProperty<boolean, OTPolicy, import("mongoose").Document<unknown, {}, OTPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    afterWorkAllowed?: import("mongoose").SchemaDefinitionProperty<boolean, OTPolicy, import("mongoose").Document<unknown, {}, OTPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minOtMinutes?: import("mongoose").SchemaDefinitionProperty<number, OTPolicy, import("mongoose").Document<unknown, {}, OTPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxOtHoursPerDay?: import("mongoose").SchemaDefinitionProperty<number, OTPolicy, import("mongoose").Document<unknown, {}, OTPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    requirePreApproval?: import("mongoose").SchemaDefinitionProperty<boolean, OTPolicy, import("mongoose").Document<unknown, {}, OTPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    compareWithCheckout?: import("mongoose").SchemaDefinitionProperty<boolean, OTPolicy, import("mongoose").Document<unknown, {}, OTPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, OTPolicy>;
