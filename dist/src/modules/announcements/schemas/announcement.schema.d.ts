import { HydratedDocument, Types } from 'mongoose';
export type AnnouncementDocument = HydratedDocument<Announcement>;
export declare class Announcement {
    tenantId: Types.ObjectId;
    title: string;
    content: string;
    targetType: 'ALL' | 'BRANCH' | 'DEPARTMENT' | 'ROLE';
    targetIds: Types.ObjectId[];
    isPinned: boolean;
    publishedAt?: Date;
    status: 'DRAFT' | 'PUBLISHED';
    createdBy: Types.ObjectId;
    readBy: Types.ObjectId[];
}
export declare const AnnouncementSchema: import("mongoose").Schema<Announcement, import("mongoose").Model<Announcement, any, any, any, any, any, Announcement>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Announcement, import("mongoose").Document<unknown, {}, Announcement, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Announcement & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Announcement, import("mongoose").Document<unknown, {}, Announcement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Announcement, import("mongoose").Document<unknown, {}, Announcement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string, Announcement, import("mongoose").Document<unknown, {}, Announcement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetType?: import("mongoose").SchemaDefinitionProperty<"ALL" | "BRANCH" | "DEPARTMENT" | "ROLE", Announcement, import("mongoose").Document<unknown, {}, Announcement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetIds?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], Announcement, import("mongoose").Document<unknown, {}, Announcement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isPinned?: import("mongoose").SchemaDefinitionProperty<boolean, Announcement, import("mongoose").Document<unknown, {}, Announcement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    publishedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Announcement, import("mongoose").Document<unknown, {}, Announcement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"DRAFT" | "PUBLISHED", Announcement, import("mongoose").Document<unknown, {}, Announcement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Announcement, import("mongoose").Document<unknown, {}, Announcement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    readBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], Announcement, import("mongoose").Document<unknown, {}, Announcement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Announcement>;
