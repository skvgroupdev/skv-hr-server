import { HydratedDocument, Types } from 'mongoose';
export type CompanyDocument = HydratedDocument<Company>;
export type CompanyStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED';
export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED';
export declare class Company {
    name: string;
    companyCode?: string;
    logo?: string;
    taxId?: string;
    address?: string;
    phone?: string;
    email?: string;
    defaultLanguage: string;
    defaultTimezone: string;
    status: CompanyStatus;
    planId: Types.ObjectId | null;
    subscription: {
        startDate?: Date;
        endDate?: Date;
        status: SubscriptionStatus;
        isPaid: boolean;
    };
}
export declare const CompanySchema: import("mongoose").Schema<Company, import("mongoose").Model<Company, any, any, any, any, any, Company>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Company, import("mongoose").Document<unknown, {}, Company, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    companyCode?: import("mongoose").SchemaDefinitionProperty<string | undefined, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    logo?: import("mongoose").SchemaDefinitionProperty<string | undefined, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    taxId?: import("mongoose").SchemaDefinitionProperty<string | undefined, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string | undefined, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string | undefined, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string | undefined, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    defaultLanguage?: import("mongoose").SchemaDefinitionProperty<string, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    defaultTimezone?: import("mongoose").SchemaDefinitionProperty<string, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<CompanyStatus, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    planId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subscription?: import("mongoose").SchemaDefinitionProperty<{
        startDate?: Date;
        endDate?: Date;
        status: SubscriptionStatus;
        isPaid: boolean;
    }, Company, import("mongoose").Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Company>;
