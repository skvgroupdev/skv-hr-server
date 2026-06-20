import { Types } from 'mongoose';
import { AttendanceAdjustmentsRepository } from './attendance-adjustments.repository';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreateAttendanceAdjustmentDto } from './dto/create-attendance-adjustment.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import type { AttendanceAdjustment } from './schemas/attendance-adjustment.schema';
export declare class AttendanceAdjustmentsService {
    private readonly repository;
    private readonly attendanceRepository;
    private readonly employeesRepository;
    private readonly auditLogService;
    constructor(repository: AttendanceAdjustmentsRepository, attendanceRepository: AttendanceRepository, employeesRepository: EmployeesRepository, auditLogService: AuditLogService);
    create(currentUser: JwtPayload, dto: CreateAttendanceAdjustmentDto): Promise<import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getMine(currentUser: JwtPayload): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    listForReviewer(currentUser: JwtPayload, status?: AttendanceAdjustment['status']): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    cancel(currentUser: JwtPayload, id: string): Promise<(import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    approve(currentUser: JwtPayload, id: string, comment?: string): Promise<(import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    reject(currentUser: JwtPayload, id: string, reason: string): Promise<(import("mongoose").Document<unknown, {}, AttendanceAdjustment, {}, import("mongoose").DefaultSchemaOptions> & AttendanceAdjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    private getOwnedPending;
    private getReviewablePending;
    private logReview;
    private assertId;
}
