import { PlansRepository } from './plans.repository';
import { CreatePlanDto } from './dto/create-plan.dto';
export declare class PlansService {
    private readonly plansRepository;
    constructor(plansRepository: PlansRepository);
    create(dto: CreatePlanDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/plan.schema").Plan, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/plan.schema").Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/plan.schema").Plan, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/plan.schema").Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/plan.schema").Plan, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/plan.schema").Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: Partial<CreatePlanDto>): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/plan.schema").Plan, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/plan.schema").Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    softDelete(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/plan.schema").Plan, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/plan.schema").Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
