import { Injectable, NotFoundException } from '@nestjs/common';
import { PlansRepository } from './plans.repository';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlansRepository) {}

  async create(dto: CreatePlanDto) {
    return this.plansRepository.create(dto);
  }

  async findAll() {
    return this.plansRepository.findAll();
  }

  async findOne(id: string) {
    const plan = await this.plansRepository.findById(id);
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async update(id: string, dto: Partial<CreatePlanDto>) {
    const existing = await this.plansRepository.findById(id);
    if (!existing) throw new NotFoundException('Plan not found');
    return this.plansRepository.update(id, dto as unknown as import('./schemas/plan.schema').Plan);
  }

  async softDelete(id: string) {
    const existing = await this.plansRepository.findById(id);
    if (!existing) throw new NotFoundException('Plan not found');
    return this.plansRepository.update(id, { isActive: false });
  }
}
