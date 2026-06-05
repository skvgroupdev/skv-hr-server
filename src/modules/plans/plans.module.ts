import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './schemas/plan.schema';
import { PlansRepository } from './plans.repository';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }])],
  providers: [PlansRepository, PlansService],
  controllers: [PlansController],
  exports: [PlansRepository, PlansService],
})
export class PlansModule {}
