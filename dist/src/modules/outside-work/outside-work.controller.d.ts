import { OutsideWorkService } from './outside-work.service';
import { CreateOutsideWorkDto } from './dto/create-outside-work.dto';
import { ApproveOutsideWorkDto, RejectOutsideWorkDto } from './dto/approve-outside-work.dto';
import { OutsideWorkQueryDto } from './dto/outside-work-query.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class OutsideWorkController {
    private readonly outsideWorkService;
    constructor(outsideWorkService: OutsideWorkService);
    request(dto: CreateOutsideWorkDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getMy(query: OutsideWorkQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
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
    getReport(query: OutsideWorkQueryDto, user: JwtPayload): Promise<{
        data: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getOne(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    approve(id: string, dto: ApproveOutsideWorkDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    reject(id: string, dto: RejectOutsideWorkDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/outside-work.schema").OutsideWork, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/outside-work.schema").OutsideWork & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
}
