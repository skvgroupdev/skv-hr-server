import { HydratedDocument, Types } from 'mongoose';
export type EmployeeDocument = HydratedDocument<Employee>;
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'PROBATION' | 'RESIGNED' | 'SUSPENDED' | 'TERMINATED';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export declare class Employee {
    tenantId: Types.ObjectId;
    employeeCode?: string;
    firstName: string;
    lastName: string;
    firstNameEn?: string;
    lastNameEn?: string;
    nickname?: string;
    gender?: Gender;
    dateOfBirth?: Date;
    phone: string;
    email?: string;
    address?: string;
    photoUrl?: string;
    nationality?: string;
    emergencyContact?: {
        name: string;
        phone: string;
        relation: string;
    } | null;
    employmentType?: EmploymentType;
    startDate?: Date;
    probationEndDate?: Date;
    resignationDate?: Date;
    status: EmployeeStatus;
    branchId: Types.ObjectId | null;
    departmentId: Types.ObjectId | null;
    positionId: Types.ObjectId | null;
    managerId: Types.ObjectId | null;
    supervisorId: Types.ObjectId | null;
    baseSalary?: number;
    allowances: {
        name: string;
        amount: number;
    }[];
    workingHoursPerMonth: number;
    bankName?: string;
    bankAccount?: string;
    paymentMethod?: string;
    userId: Types.ObjectId | null;
}
export declare const EmployeeSchema: import("mongoose").Schema<Employee, import("mongoose").Model<Employee, any, any, any, any, any, Employee>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Employee, import("mongoose").Document<unknown, {}, Employee, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeCode?: import("mongoose").SchemaDefinitionProperty<string | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    firstName?: import("mongoose").SchemaDefinitionProperty<string, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastName?: import("mongoose").SchemaDefinitionProperty<string, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    firstNameEn?: import("mongoose").SchemaDefinitionProperty<string | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastNameEn?: import("mongoose").SchemaDefinitionProperty<string | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nickname?: import("mongoose").SchemaDefinitionProperty<string | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gender?: import("mongoose").SchemaDefinitionProperty<Gender | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dateOfBirth?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    photoUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nationality?: import("mongoose").SchemaDefinitionProperty<string | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    emergencyContact?: import("mongoose").SchemaDefinitionProperty<{
        name: string;
        phone: string;
        relation: string;
    } | null | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employmentType?: import("mongoose").SchemaDefinitionProperty<EmploymentType | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    probationEndDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    resignationDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<EmployeeStatus, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    branchId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    departmentId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    positionId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    managerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    supervisorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    baseSalary?: import("mongoose").SchemaDefinitionProperty<number | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    allowances?: import("mongoose").SchemaDefinitionProperty<{
        name: string;
        amount: number;
    }[], Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    workingHoursPerMonth?: import("mongoose").SchemaDefinitionProperty<number, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bankName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bankAccount?: import("mongoose").SchemaDefinitionProperty<string | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<string | undefined, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Employee>;
