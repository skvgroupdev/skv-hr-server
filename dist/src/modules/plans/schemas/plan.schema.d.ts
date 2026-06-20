import { HydratedDocument } from 'mongoose';
export type PlanDocument = HydratedDocument<Plan>;
export interface PlanFeatures {
    attendance: boolean;
    shiftManagement: boolean;
    attendanceAdjustment: boolean;
    leave: boolean;
    ot: boolean;
    payroll: boolean;
    restDayCompensation: boolean;
    advancedReport: boolean;
    announcement: boolean;
}
export type PlanFeature = keyof PlanFeatures;
export declare class Plan {
    name: string;
    description?: string;
    maxEmployees: number;
    maxBranches: number;
    maxStorageGB: number;
    features: PlanFeatures;
    trialDays: number;
    price: number;
    currency: string;
    isActive: boolean;
}
export declare const PlanSchema: import("mongoose").Schema<Plan, import("mongoose").Model<Plan, any, any, any, any, any, Plan>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Plan, import("mongoose").Document<unknown, {}, Plan, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Plan, import("mongoose").Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, Plan, import("mongoose").Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxEmployees?: import("mongoose").SchemaDefinitionProperty<number, Plan, import("mongoose").Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxBranches?: import("mongoose").SchemaDefinitionProperty<number, Plan, import("mongoose").Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxStorageGB?: import("mongoose").SchemaDefinitionProperty<number, Plan, import("mongoose").Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    features?: import("mongoose").SchemaDefinitionProperty<PlanFeatures, Plan, import("mongoose").Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    trialDays?: import("mongoose").SchemaDefinitionProperty<number, Plan, import("mongoose").Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, Plan, import("mongoose").Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currency?: import("mongoose").SchemaDefinitionProperty<string, Plan, import("mongoose").Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Plan, import("mongoose").Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Plan>;
