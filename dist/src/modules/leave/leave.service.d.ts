import { Types } from 'mongoose';
import { LeaveRepository } from './leave.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { UsersRepository } from '../users/users.repository';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { ApproveLeaveDto, RejectLeaveDto } from './dto/approve-leave.dto';
import { LeaveBalanceAdjustDto } from './dto/leave-balance-adjust.dto';
import { LeaveQueryDto } from './dto/leave-query.dto';
export declare class LeaveService {
    private readonly leaveRepository;
    private readonly employeesRepository;
    private readonly notificationsService;
    private readonly notificationsGateway;
    private readonly usersRepository;
    constructor(leaveRepository: LeaveRepository, employeesRepository: EmployeesRepository, notificationsService: NotificationsService, notificationsGateway: NotificationsGateway, usersRepository: UsersRepository);
    createLeaveType(tenantId: string, dto: CreateLeaveTypeDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/leave-type.schema").LeaveType, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-type.schema").LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllLeaveTypes(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leave-type.schema").LeaveType, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-type.schema").LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateLeaveType(tenantId: string, id: string, dto: Partial<CreateLeaveTypeDto>): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leave-type.schema").LeaveType, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-type.schema").LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteLeaveType(tenantId: string, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leave-type.schema").LeaveType, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-type.schema").LeaveType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    request(tenantId: string, userId: string, dto: CreateLeaveRequestDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getMy(tenantId: string, userId: string, query: LeaveQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
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
    getOne(tenantId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    approve(tenantId: string, id: string, actorId: string, actorRole: string, dto: ApproveLeaveDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    reject(tenantId: string, id: string, actorId: string, actorRole: string, dto: RejectLeaveDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    cancel(tenantId: string, id: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getReport(tenantId: string, query: LeaveQueryDto): Promise<{
        data: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyBalance(tenantId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leave-balance.schema").LeaveBalance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-balance.schema").LeaveBalance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getEmployeeBalance(tenantId: string, employeeId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leave-balance.schema").LeaveBalance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-balance.schema").LeaveBalance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    adjustBalance(tenantId: string, employeeId: string, dto: LeaveBalanceAdjustDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/leave-balance.schema").LeaveBalance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-balance.schema").LeaveBalance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    private notifyManagersOnNewRequest;
    private notifyBranchManager;
    private emitStatusChangedToEmployee;
    private notifyEmployee;
    private toResponse;
    private findEmployeeByUserId;
}
