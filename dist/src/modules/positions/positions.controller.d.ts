import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionQueryDto } from './dto/position-query.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class PositionsController {
    private readonly positionsService;
    constructor(positionsService: PositionsService);
    create(dto: CreatePositionDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/position.schema").Position, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    list(query: PositionQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/position.schema").Position, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
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
    getOne(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/position.schema").Position, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, dto: UpdatePositionDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/position.schema").Position, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    softDelete(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/position.schema").Position, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
}
