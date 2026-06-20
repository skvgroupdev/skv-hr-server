import { HydratedDocument, Types } from 'mongoose';
export type CompanyTaxConfigDocument = HydratedDocument<CompanyTaxConfig>;
export declare enum TaxMode {
    FULL_DEDUCTION = "FULL_DEDUCTION",
    TAX_ON_COMPANY = "TAX_ON_COMPANY",
    SS_ONLY = "SS_ONLY",
    NO_DEDUCTION = "NO_DEDUCTION"
}
export declare class CompanyTaxConfig {
    tenantId: Types.ObjectId;
    taxConfigId: Types.ObjectId;
    taxMode: TaxMode;
    enableEmployeeSs: boolean;
    enableEmployerSs: boolean;
    enableIncomeTax: boolean;
    updatedBy?: Types.ObjectId;
}
export declare const CompanyTaxConfigSchema: import("mongoose").Schema<CompanyTaxConfig, import("mongoose").Model<CompanyTaxConfig, any, any, any, any, any, CompanyTaxConfig>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CompanyTaxConfig, import("mongoose").Document<unknown, {}, CompanyTaxConfig, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CompanyTaxConfig & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, CompanyTaxConfig, import("mongoose").Document<unknown, {}, CompanyTaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyTaxConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    taxConfigId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, CompanyTaxConfig, import("mongoose").Document<unknown, {}, CompanyTaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyTaxConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    taxMode?: import("mongoose").SchemaDefinitionProperty<TaxMode, CompanyTaxConfig, import("mongoose").Document<unknown, {}, CompanyTaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyTaxConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    enableEmployeeSs?: import("mongoose").SchemaDefinitionProperty<boolean, CompanyTaxConfig, import("mongoose").Document<unknown, {}, CompanyTaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyTaxConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    enableEmployerSs?: import("mongoose").SchemaDefinitionProperty<boolean, CompanyTaxConfig, import("mongoose").Document<unknown, {}, CompanyTaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyTaxConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    enableIncomeTax?: import("mongoose").SchemaDefinitionProperty<boolean, CompanyTaxConfig, import("mongoose").Document<unknown, {}, CompanyTaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyTaxConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, CompanyTaxConfig, import("mongoose").Document<unknown, {}, CompanyTaxConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyTaxConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CompanyTaxConfig>;
