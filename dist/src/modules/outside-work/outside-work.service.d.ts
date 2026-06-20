import { Types } from 'mongoose';
import { OutsideWorkRepository } from './outside-work.repository';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { CreateOutsideWorkDto } from './dto/create-outside-work.dto';
import { ApproveOutsideWorkDto, RejectOutsideWorkDto } from './dto/approve-outside-work.dto';
import { OutsideWorkQueryDto } from './dto/outside-work-query.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { UsersRepository } from '../users/users.repository';
export declare class OutsideWorkService {
    private readonly outsideWorkRepository;
    private readonly attendanceRepository;
    private readonly employeesRepository;
    private readonly notificationsService;
    private readonly notificationsGateway;
    private readonly usersRepository;
    constructor(outsideWorkRepository: OutsideWorkRepository, attendanceRepository: AttendanceRepository, employeesRepository: EmployeesRepository, notificationsService: NotificationsService, notificationsGateway: NotificationsGateway, usersRepository: UsersRepository);
    request(tenantId: string, userId: string, dto: CreateOutsideWorkDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getMy(tenantId: string, userId: string, query: OutsideWorkQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPending(tenantId: string): Promise<Record<string, unknown>[]>;
    getOne(tenantId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    approve(tenantId: string, id: string, actorId: string, dto: ApproveOutsideWorkDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    reject(tenantId: string, id: string, actorId: string, dto: RejectOutsideWorkDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getReport(tenantId: string, query: OutsideWorkQueryDto): Promise<{
        data: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    private notifyManagersOnNewRequest;
    private notifyBranchManager;
    private emitStatusChangedToEmployee;
    private notifyEmployee;
    private toResponse;
    private findEmployeeByUserId;
}
