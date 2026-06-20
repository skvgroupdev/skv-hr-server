import { AttendanceAdjustmentsService } from './attendance-adjustments.service';
import { CreateAttendanceAdjustmentDto } from './dto/create-attendance-adjustment.dto';
import { RejectAttendanceAdjustmentDto, ReviewAttendanceAdjustmentDto } from './dto/review-attendance-adjustment.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import type { AttendanceAdjustment } from './schemas/attendance-adjustment.schema';
export declare class AttendanceAdjustmentsController {
    private readonly service;
    constructor(service: AttendanceAdjustmentsService);
    create(dto: CreateAttendanceAdjustmentDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    mine(user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    list(user: JwtPayload, status?: AttendanceAdjustment['status']): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    cancel(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    approve(id: string, dto: ReviewAttendanceAdjustmentDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    reject(id: string, dto: RejectAttendanceAdjustmentDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
}
