import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan, PlanDocument } from './schemas/plan.schema';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansRepository {
  constructor(@InjectModel(Plan.name) private readonly model: Model<PlanDocument>) {}

  create(dto: CreatePlanDto): Promise<PlanDocument> {
    return this.model.create(dto);
  }

  findAll(): Promise<PlanDocument[]> {
    return this.model.find({ isActive: true }).sort({ price: 1 }).exec();
  }

  findById(id: string): Promise<PlanDocument | null> {
    return this.model.findById(id).exec();
  }

  update(id: string, data: Partial<Plan>): Promise<PlanDocument | null> {
    return this.model.findByIdAndUpdate(id, data, { returnDocument: 'after' }).exec();
  }
}
