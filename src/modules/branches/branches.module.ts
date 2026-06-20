import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from './schemas/branch.schema';
import { BranchesRepository } from './branches.repository';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { AuditLogModule } from '../audit-logs/audit-log.module';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Branch.name, schema: BranchSchema }]),
    AuditLogModule,
    EmployeesModule,
    UsersModule,
    CompaniesModule,
    PlansModule,
  ],
  providers: [BranchesRepository, BranchesService],
  controllers: [BranchesController],
  exports: [BranchesRepository],
})
export class BranchesModule {}
