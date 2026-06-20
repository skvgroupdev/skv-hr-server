import { Types } from 'mongoose';
import { PositionsRepository } from './positions.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionQueryDto } from './dto/position-query.dto';
export declare class PositionsService {
    private readonly positionsRepository;
    private readonly auditLogService;
    constructor(positionsRepository: PositionsRepository, auditLogService: AuditLogService);
    create(tenantId: string, dto: CreatePositionDto, actorId: string, actorRole: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/position.schema").Position, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/position.schema").Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    list(tenantId: string, query: PositionQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/position.schema").Position, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/position.schema").Position & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getOne(tenantId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/position.schema").Position, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/position.schema").Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenantId: string, id: string, dto: UpdatePositionDto, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/position.schema").Position, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/position.schema").Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    softDelete(tenantId: string, id: string, actorId: string, actorRole: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/position.schema").Position, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/position.schema").Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
