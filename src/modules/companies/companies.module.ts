import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema';
import { CompaniesRepository } from './companies.repository';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { UsersModule } from '../users/users.module';
import { AuditLogModule } from '../audit-logs/audit-log.module';
import { PlansModule } from '../plans/plans.module';
import { Branch, BranchSchema } from '../branches/schemas/branch.schema';
import { Employee, EmployeeSchema } from '../employees/schemas/employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Employee.name, schema: EmployeeSchema },
    ]),
    UsersModule,
    AuditLogModule,
    PlansModule,
  ],
  providers: [CompaniesRepository, CompaniesService],
  controllers: [CompaniesController],
  exports: [CompaniesRepository],
})
export class CompaniesModule {}
