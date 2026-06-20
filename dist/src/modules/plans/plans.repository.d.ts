import { Model } from 'mongoose';
import { Plan, PlanDocument } from './schemas/plan.schema';
import { CreatePlanDto } from './dto/create-plan.dto';
export declare class PlansRepository {
    private readonly model;
    constructor(model: Model<PlanDocument>);
    create(dto: CreatePlanDto): Promise<PlanDocument>;
    findAll(): Promise<PlanDocument[]>;
    findById(id: string): Promise<PlanDocument | null>;
    update(id: string, data: Partial<Plan>): Promise<PlanDocument | null>;
    findByName(name: string): Promise<PlanDocument | null>;
}
