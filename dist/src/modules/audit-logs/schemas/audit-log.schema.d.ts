import { HydratedDocument, Types } from 'mongoose';
export type AuditLogDocument = HydratedDocument<AuditLog>;
export declare class AuditLog {
    tenantId: Types.ObjectId | null;
    actorId: Types.ObjectId;
    actorRole: string;
    action: string;
    module?: string;
    targetId: Types.ObjectId | null;
    before: Record<string, unknown> | null;
    after: Record<string, unknown> | null;
    ipAddress?: string;
    userAgent?: string;
}
export declare const AuditLogSchema: import("mongoose").Schema<AuditLog, import("mongoose").Model<AuditLog, any, any, any, any, any, AuditLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AuditLog, import("mongoose").Document<unknown, {}, AuditLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, AuditLog, import("mongoose").Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    actorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AuditLog, import("mongoose").Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    actorRole?: import("mongoose").SchemaDefinitionProperty<string, AuditLog, import("mongoose").Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    action?: import("mongoose").SchemaDefinitionProperty<string, AuditLog, import("mongoose").Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    module?: import("mongoose").SchemaDefinitionProperty<string | undefined, AuditLog, import("mongoose").Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, AuditLog, import("mongoose").Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    before?: import("mongoose").SchemaDefinitionProperty<Record<string, unknown> | null, AuditLog, import("mongoose").Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    after?: import("mongoose").SchemaDefinitionProperty<Record<string, unknown> | null, AuditLog, import("mongoose").Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ipAddress?: import("mongoose").SchemaDefinitionProperty<string | undefined, AuditLog, import("mongoose").Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userAgent?: import("mongoose").SchemaDefinitionProperty<string | undefined, AuditLog, import("mongoose").Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, AuditLog>;
