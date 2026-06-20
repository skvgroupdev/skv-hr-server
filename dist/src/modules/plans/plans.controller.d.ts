import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    create(dto: CreatePlanDto): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/plan.schema").Plan, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/plan.schema").Plan & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/plan.schema").Plan, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/plan.schema").Plan & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findOne(id: string): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/plan.schema").Plan, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/plan.schema").Plan & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, dto: Partial<CreatePlanDto>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/plan.schema").Plan, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/plan.schema").Plan & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    softDelete(id: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/plan.schema").Plan, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/plan.schema").Plan & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
}
