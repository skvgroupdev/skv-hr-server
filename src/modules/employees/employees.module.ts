import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { EmployeesRepository } from './employees.repository';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { UsersModule } from '../users/users.module';
import { AuditLogModule } from '../audit-logs/audit-log.module';
import { DocumentsModule } from '../documents/documents.module';
import { CompaniesModule } from '../companies/companies.module';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),
    UsersModule,
    AuditLogModule,
    DocumentsModule,
    CompaniesModule,
    PlansModule,
  ],
  providers: [EmployeesRepository, EmployeesService],
  controllers: [EmployeesController],
  exports: [EmployeesRepository],
})
export class EmployeesModule {}
