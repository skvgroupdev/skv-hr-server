import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchQueryDto } from './dto/branch-query.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    create(dto: CreateBranchDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    list(query: BranchQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
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
        data: import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, dto: UpdateBranchDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    softDelete(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    activate(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    deactivate(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    assignManager(id: string, body: {
        employeeId: string;
    }, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/branch.schema").Branch & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
}
