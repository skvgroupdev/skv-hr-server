import { HydratedDocument, Types } from 'mongoose';
export type ShiftDocument = HydratedDocument<Shift>;
export declare class Shift {
    tenantId: Types.ObjectId;
    name: string;
    startTime?: string;
    endTime?: string;
    breakStartTime?: string;
    breakEndTime?: string;
    gracePeriodMinutes: number;
    isOvernight: boolean;
    workDays: number[];
    isActive: boolean;
}
export declare const ShiftSchema: import("mongoose").Schema<Shift, import("mongoose").Model<Shift, any, any, any, any, any, Shift>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Shift, import("mongoose").Document<unknown, {}, Shift, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Shift, import("mongoose").Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Shift, import("mongoose").Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startTime?: import("mongoose").SchemaDefinitionProperty<string | undefined, Shift, import("mongoose").Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endTime?: import("mongoose").SchemaDefinitionProperty<string | undefined, Shift, import("mongoose").Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    breakStartTime?: import("mongoose").SchemaDefinitionProperty<string | undefined, Shift, import("mongoose").Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    breakEndTime?: import("mongoose").SchemaDefinitionProperty<string | undefined, Shift, import("mongoose").Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gracePeriodMinutes?: import("mongoose").SchemaDefinitionProperty<number, Shift, import("mongoose").Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isOvernight?: import("mongoose").SchemaDefinitionProperty<boolean, Shift, import("mongoose").Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    workDays?: import("mongoose").SchemaDefinitionProperty<number[], Shift, import("mongoose").Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Shift, import("mongoose").Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Shift>;
