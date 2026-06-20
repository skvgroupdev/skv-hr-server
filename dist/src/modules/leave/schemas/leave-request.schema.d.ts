import { HydratedDocument, Types } from 'mongoose';
export type LeaveRequestDocument = HydratedDocument<LeaveRequest>;
export declare class LeaveRequest {
    tenantId: Types.ObjectId;
    employeeId: Types.ObjectId;
    leaveTypeId?: Types.ObjectId;
    leaveTypeName?: string;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    isHalfDay: boolean;
    halfDayPeriod?: 'AM' | 'PM';
    reason: string;
    attachmentUrls: string[];
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    currentApprovalStep: number;
    approvals: Array<{
        approverId: Types.ObjectId;
        role: string;
        status: 'PENDING' | 'APPROVED' | 'REJECTED';
        comment?: string;
        approvedAt?: Date;
    }>;
}
export declare const LeaveRequestSchema: import("mongoose").Schema<LeaveRequest, import("mongoose").Model<LeaveRequest, any, any, any, any, any, LeaveRequest>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    leaveTypeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    leaveTypeName?: import("mongoose").SchemaDefinitionProperty<string | undefined, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalDays?: import("mongoose").SchemaDefinitionProperty<number, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isHalfDay?: import("mongoose").SchemaDefinitionProperty<boolean, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    halfDayPeriod?: import("mongoose").SchemaDefinitionProperty<"AM" | "PM" | undefined, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    attachmentUrls?: import("mongoose").SchemaDefinitionProperty<string[], LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"CANCELLED" | "PENDING" | "APPROVED" | "REJECTED", LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currentApprovalStep?: import("mongoose").SchemaDefinitionProperty<number, LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    approvals?: import("mongoose").SchemaDefinitionProperty<{
        approverId: Types.ObjectId;
        role: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        comment?: string;
        approvedAt?: Date;
    }[], LeaveRequest, import("mongoose").Document<unknown, {}, LeaveRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, LeaveRequest>;
