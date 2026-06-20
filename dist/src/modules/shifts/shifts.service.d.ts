import { Types } from 'mongoose';
import { ShiftsRepository } from './shifts.repository';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { AssignShiftDto } from './dto/assign-shift.dto';
import { BulkAssignShiftDto } from './dto/bulk-assign-shift.dto';
import { EmployeesRepository } from '../employees/employees.repository';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class ShiftsService {
    private readonly shiftsRepository;
    private readonly employeesRepository;
    constructor(shiftsRepository: ShiftsRepository, employeesRepository: EmployeesRepository);
    create(tenantId: string, dto: CreateShiftDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/shift.schema").Shift, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift.schema").Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/shift.schema").Shift, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift.schema").Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(tenantId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/shift.schema").Shift, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift.schema").Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenantId: string, id: string, dto: UpdateShiftDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/shift.schema").Shift, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift.schema").Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    softDelete(tenantId: string, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/shift.schema").Shift, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift.schema").Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    assignToEmployee(tenantId: string, shiftId: string, dto: AssignShiftDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/shift-assignment.schema").ShiftAssignment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift-assignment.schema").ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getEmployeeShift(currentUser: JwtPayload, employeeId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/shift-assignment.schema").ShiftAssignment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift-assignment.schema").ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getEmployeeShiftHistory(currentUser: JwtPayload, employeeId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/shift-assignment.schema").ShiftAssignment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift-assignment.schema").ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    bulkAssignShift(user: JwtPayload, dto: BulkAssignShiftDto): Promise<{
        success: unknown[];
        failed: {
            employeeId: string;
            reason: string;
        }[];
    }>;
    private assertObjectId;
    private refId;
}
