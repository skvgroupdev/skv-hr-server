import { OTService } from './ot.service';
import { CreateOTRequestDto } from './dto/create-ot-request.dto';
import { UpdateOTPolicyDto } from './dto/update-ot-policy.dto';
import { ApproveOTDto, RejectOTDto } from './dto/approve-ot.dto';
import { OTQueryDto } from './dto/ot-query.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class OTController {
    private readonly otService;
    constructor(otService: OTService);
    getPolicy(user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/ot-policy.schema").OTPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-policy.schema").OTPolicy & {
            _id: import("mongoose").Types.ObjectId;
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
        };
    }>;
    updatePolicy(dto: UpdateOTPolicyDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/ot-policy.schema").OTPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-policy.schema").OTPolicy & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    request(dto: CreateOTRequestDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getMy(query: OTQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
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
        data: (import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getReport(query: OTQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
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
    getOne(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    approve(id: string, dto: ApproveOTDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    reject(id: string, dto: RejectOTDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    cancel(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/ot-request.schema").OTRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ot-request.schema").OTRequest & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
}
