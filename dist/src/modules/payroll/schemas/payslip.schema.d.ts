import { HydratedDocument, Types } from 'mongoose';
export type PayslipDocument = HydratedDocument<Payslip>;
export interface PayrollAdjustment {
    kind: 'ADDITION' | 'DEDUCTION';
    name: string;
    amount: number;
    reason: string;
    source: 'SYSTEM' | 'MANUAL' | 'PREVIOUS_PERIOD_CORRECTION';
    createdBy?: Types.ObjectId;
    createdAt: Date;
}
export declare class Payslip {
    tenantId: Types.ObjectId;
    payrollPeriodId: Types.ObjectId;
    employeeId: Types.ObjectId;
    baseSalary: number;
    allowances: {
        name: string;
        amount: number;
    }[];
    otHours: number;
    otAmount: number;
    grossSalary: number;
    employeeSsAmount: number;
    taxableIncome: number;
    incomeTax: number;
    otherDeductions: {
        name: string;
        amount: number;
    }[];
    totalDeductions: number;
    netSalary: number;
    employerSsAmount: number;
    taxConfigSnapshot?: Record<string, unknown>;
    taxMode?: string;
    leaveDeductionDays: number;
    leaveDeductionAmount: number;
    approvedRestDays: number;
    unusedRestDays: number;
    restDayCompensationAmount: number;
    payrollPolicySnapshot?: Record<string, unknown>;
    adjustments: PayrollAdjustment[];
    status: 'DRAFT' | 'HR_REVIEWED' | 'PAID' | 'APPROVED';
}
export declare const PayslipSchema: import("mongoose").Schema<Payslip, import("mongoose").Model<Payslip, any, any, any, any, any, Payslip>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    payrollPeriodId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    baseSalary?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    allowances?: import("mongoose").SchemaDefinitionProperty<{
        name: string;
        amount: number;
    }[], Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    otHours?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    otAmount?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    grossSalary?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeSsAmount?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    taxableIncome?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    incomeTax?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    otherDeductions?: import("mongoose").SchemaDefinitionProperty<{
        name: string;
        amount: number;
    }[], Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalDeductions?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    netSalary?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employerSsAmount?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    taxConfigSnapshot?: import("mongoose").SchemaDefinitionProperty<Record<string, unknown> | undefined, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    taxMode?: import("mongoose").SchemaDefinitionProperty<string | undefined, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    leaveDeductionDays?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    leaveDeductionAmount?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    approvedRestDays?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unusedRestDays?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    restDayCompensationAmount?: import("mongoose").SchemaDefinitionProperty<number, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    payrollPolicySnapshot?: import("mongoose").SchemaDefinitionProperty<Record<string, unknown> | undefined, Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    adjustments?: import("mongoose").SchemaDefinitionProperty<PayrollAdjustment[], Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"APPROVED" | "DRAFT" | "HR_REVIEWED" | "PAID", Payslip, import("mongoose").Document<unknown, {}, Payslip, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payslip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Payslip>;
