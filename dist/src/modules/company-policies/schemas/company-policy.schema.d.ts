import { HydratedDocument, Types } from 'mongoose';
export type CompanyPolicyDocument = HydratedDocument<CompanyPolicy>;
export type WorkScheduleMode = 'UNIFORM' | 'SHIFT_BASED';
export type SalaryCalculationMode = 'MONTHLY_FIXED' | 'ATTENDANCE_BASED';
export type DailyRateMethod = 'CALENDAR_30' | 'SCHEDULED_WORKDAYS';
export declare class CompanyPolicy {
    tenantId: Types.ObjectId;
    effectiveFrom: Date;
    workScheduleMode: WorkScheduleMode;
    uniformSchedule: {
        startTime: string;
        endTime: string;
        breakStartTime?: string;
        breakEndTime?: string;
        workDays: number[];
        gracePeriodMinutes: number;
        isOvernight: boolean;
    };
    salaryCalculationMode: SalaryCalculationMode;
    dailyRateMethod: DailyRateMethod;
    restDayPolicyEnabled: boolean;
    monthlyRestDays: number;
    unusedRestDayCompensationEnabled: boolean;
    unusedRestDaysCarryForward: boolean;
    lateToleranceMinutes: number;
    earlyLeaveToleranceMinutes: number;
    absenceDeductionEnabled: boolean;
    createdBy: Types.ObjectId;
}
export declare const CompanyPolicySchema: import("mongoose").Schema<CompanyPolicy, import("mongoose").Model<CompanyPolicy, any, any, any, any, any, CompanyPolicy>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    effectiveFrom?: import("mongoose").SchemaDefinitionProperty<Date, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    workScheduleMode?: import("mongoose").SchemaDefinitionProperty<WorkScheduleMode, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    uniformSchedule?: import("mongoose").SchemaDefinitionProperty<{
        startTime: string;
        endTime: string;
        breakStartTime?: string;
        breakEndTime?: string;
        workDays: number[];
        gracePeriodMinutes: number;
        isOvernight: boolean;
    }, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    salaryCalculationMode?: import("mongoose").SchemaDefinitionProperty<SalaryCalculationMode, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dailyRateMethod?: import("mongoose").SchemaDefinitionProperty<DailyRateMethod, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    restDayPolicyEnabled?: import("mongoose").SchemaDefinitionProperty<boolean, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    monthlyRestDays?: import("mongoose").SchemaDefinitionProperty<number, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unusedRestDayCompensationEnabled?: import("mongoose").SchemaDefinitionProperty<boolean, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unusedRestDaysCarryForward?: import("mongoose").SchemaDefinitionProperty<boolean, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lateToleranceMinutes?: import("mongoose").SchemaDefinitionProperty<number, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    earlyLeaveToleranceMinutes?: import("mongoose").SchemaDefinitionProperty<number, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    absenceDeductionEnabled?: import("mongoose").SchemaDefinitionProperty<boolean, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, CompanyPolicy, import("mongoose").Document<unknown, {}, CompanyPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CompanyPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CompanyPolicy>;
