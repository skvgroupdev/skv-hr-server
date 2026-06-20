import { HydratedDocument, Types } from 'mongoose';
export type DocumentRecordDocument = HydratedDocument<DocumentRecord>;
export type DocumentType = 'ID_CARD' | 'PASSPORT' | 'CONTRACT' | 'CV' | 'CERTIFICATE' | 'MEDICAL' | 'OTHER';
export declare class DocumentRecord {
    tenantId: Types.ObjectId;
    employeeId: Types.ObjectId;
    fileName?: string;
    fileUrl?: string;
    fileType?: string;
    documentType: DocumentType;
    description?: string;
    uploadedBy?: Types.ObjectId;
}
export declare const DocumentRecordSchema: import("mongoose").Schema<DocumentRecord, import("mongoose").Model<DocumentRecord, any, any, any, any, any, DocumentRecord>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DocumentRecord, import("mongoose").Document<unknown, {}, DocumentRecord, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DocumentRecord, import("mongoose").Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DocumentRecord, import("mongoose").Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fileName?: import("mongoose").SchemaDefinitionProperty<string | undefined, DocumentRecord, import("mongoose").Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fileUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, DocumentRecord, import("mongoose").Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fileType?: import("mongoose").SchemaDefinitionProperty<string | undefined, DocumentRecord, import("mongoose").Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    documentType?: import("mongoose").SchemaDefinitionProperty<DocumentType, DocumentRecord, import("mongoose").Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, DocumentRecord, import("mongoose").Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    uploadedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, DocumentRecord, import("mongoose").Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, DocumentRecord>;
