import { LeaveService } from './leave.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { ApproveLeaveDto, RejectLeaveDto } from './dto/approve-leave.dto';
import { LeaveBalanceAdjustDto } from './dto/leave-balance-adjust.dto';
import { LeaveQueryDto } from './dto/leave-query.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    createLeaveType(dto: CreateLeaveTypeDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/leave-type.schema").LeaveType, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-type.schema").LeaveType & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAllLeaveTypes(user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/leave-type.schema").LeaveType, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-type.schema").LeaveType & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    updateLeaveType(id: string, dto: Partial<CreateLeaveTypeDto>, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/leave-type.schema").LeaveType, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-type.schema").LeaveType & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    deleteLeaveType(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/leave-type.schema").LeaveType, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-type.schema").LeaveType & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    request(dto: CreateLeaveRequestDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getMy(query: LeaveQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPending(user: JwtPayload): Promise<{
        data: Record<string, unknown>[];
    }>;
    getReport(query: LeaveQueryDto, user: JwtPayload): Promise<{
        data: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyBalance(user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/leave-balance.schema").LeaveBalance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-balance.schema").LeaveBalance & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getEmployeeBalance(employeeId: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/leave-balance.schema").LeaveBalance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-balance.schema").LeaveBalance & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    adjustBalance(employeeId: string, dto: LeaveBalanceAdjustDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/leave-balance.schema").LeaveBalance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-balance.schema").LeaveBalance & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    getOne(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    approve(id: string, dto: ApproveLeaveDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    reject(id: string, dto: RejectLeaveDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    cancel(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/leave-request.schema").LeaveRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/leave-request.schema").LeaveRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
}
