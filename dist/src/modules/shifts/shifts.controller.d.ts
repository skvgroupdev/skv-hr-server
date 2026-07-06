import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { AssignShiftDto } from './dto/assign-shift.dto';
import { BulkAssignShiftDto } from './dto/bulk-assign-shift.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class ShiftsController {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
    create(dto: CreateShiftDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/shift.schema").Shift, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift.schema").Shift & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/shift.schema").Shift, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift.schema").Shift & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findOne(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/shift.schema").Shift, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift.schema").Shift & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, dto: UpdateShiftDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/shift.schema").Shift, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift.schema").Shift & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    softDelete(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/shift.schema").Shift, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift.schema").Shift & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    assign(id: string, dto: AssignShiftDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/shift-assignment.schema").ShiftAssignment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift-assignment.schema").ShiftAssignment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    getEmployeeShift(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/shift-assignment.schema").ShiftAssignment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift-assignment.schema").ShiftAssignment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getEmployeeShiftHistory(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/shift-assignment.schema").ShiftAssignment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/shift-assignment.schema").ShiftAssignment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    bulkAssign(dto: BulkAssignShiftDto, user: JwtPayload): Promise<{
        data: {
            success: unknown[];
            failed: {
                employeeId: string;
                reason: string;
            }[];
        };
    }>;
}
