import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../modules/users/schemas/user.schema';
import { TaxConfig, TaxConfigSchema } from '../modules/tax-configs/schemas/tax-config.schema';
import { Plan, PlanSchema } from '../modules/plans/schemas/plan.schema';
import { Position, PositionSchema } from '../modules/positions/schemas/position.schema';
import { Employee, EmployeeSchema } from '../modules/employees/schemas/employee.schema';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skv_hr'),
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
class SeedAppModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedAppModule, {
    logger: ['log', 'error', 'warn'],
  });
  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
