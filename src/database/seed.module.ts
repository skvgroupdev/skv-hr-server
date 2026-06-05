import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../modules/users/schemas/user.schema';
import { TaxConfig, TaxConfigSchema } from '../modules/tax-configs/schemas/tax-config.schema';
import { Plan, PlanSchema } from '../modules/plans/schemas/plan.schema';
import { Position, PositionSchema } from '../modules/positions/schemas/position.schema';
import { Employee, EmployeeSchema } from '../modules/employees/schemas/employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TaxConfig.name, schema: TaxConfigSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Position.name, schema: PositionSchema },
      { name: Employee.name, schema: EmployeeSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
