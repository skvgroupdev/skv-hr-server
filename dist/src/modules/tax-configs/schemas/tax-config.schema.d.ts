import { HydratedDocument } from 'mongoose';
export type TaxConfigDocument = HydratedDocument<TaxConfig>;
export interface TaxBracket {
    from: number;
    to: number | null;
    rate: number;
}
export declare class TaxConfig {
    country: string;
    year: number;
    currency: string;
    brackets: TaxBracket[];
    employeeSsRate: number;
    employerSsRate: number;
    effectiveFrom: Date;
}
export declare const TaxConfigSchema: import("mongoose").Schema<TaxConfig, import("mongoose").Model<TaxConfig, any, any, any, any, any, TaxConfig>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TaxConfig, import("mongoose").Document<unknown, {}, TaxConfig, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TaxConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    country?: import("mongoose").SchemaDefinitionProperty<string, TaxConfig, import("mongoose").Document<unknown, {}, TaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    year?: import("mongoose").SchemaDefinitionProperty<number, TaxConfig, import("mongoose").Document<unknown, {}, TaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currency?: import("mongoose").SchemaDefinitionProperty<string, TaxConfig, import("mongoose").Document<unknown, {}, TaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    brackets?: import("mongoose").SchemaDefinitionProperty<TaxBracket[], TaxConfig, import("mongoose").Document<unknown, {}, TaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeSsRate?: import("mongoose").SchemaDefinitionProperty<number, TaxConfig, import("mongoose").Document<unknown, {}, TaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employerSsRate?: import("mongoose").SchemaDefinitionProperty<number, TaxConfig, import("mongoose").Document<unknown, {}, TaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    effectiveFrom?: import("mongoose").SchemaDefinitionProperty<Date, TaxConfig, import("mongoose").Document<unknown, {}, TaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TaxConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, TaxConfig>;
