import { Types } from 'mongoose';
import { OTRepository } from './ot.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { UsersRepository } from '../users/users.repository';
import { CreateOTRequestDto } from './dto/create-ot-request.dto';
import { UpdateOTPolicyDto } from './dto/update-ot-policy.dto';
import { ApproveOTDto, RejectOTDto } from './dto/approve-ot.dto';
import { OTQueryDto } from './dto/ot-query.dto';
export declare class OTService {
    private readonly otRepository;
    private readonly employeesRepository;
    private readonly notificationsGateway;
    private readonly usersRepository;
    constructor(otRepository: OTRepository, employeesRepository: EmployeesRepository, notificationsGateway: NotificationsGateway, usersRepository: UsersRepository);
    getPolicy(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/ot-policy.schema").OTPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-policy.schema").OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | {
        weekdayRate: number;
        weekendRate: number;
        holidayRate: number;
        maxOtHoursPerDay: number;
        minOtMinutes: number;
        requirePreApproval: boolean;
    }>;
    updatePolicy(tenantId: string, dto: UpdateOTPolicyDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ot-policy.schema").OTPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-policy.schema").OTPolicy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    request(tenantId: string, userId: string, dto: CreateOTRequestDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getMy(tenantId: string, userId: string, query: OTQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
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
    getPending(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getOne(tenantId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    approve(tenantId: string, id: string, actorId: string, actorRole: string, dto: ApproveOTDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    reject(tenantId: string, id: string, actorId: string, actorRole: string, dto: RejectOTDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    cancel(tenantId: string, id: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getReport(tenantId: string, query: OTQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
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
    private notifyManagersOnNewOTRequest;
    private notifyBranchManager;
    private emitStatusChangedToEmployee;
    private findEmployeeByUserId;
}
