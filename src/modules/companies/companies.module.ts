import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema';
import { CompaniesRepository } from './companies.repository';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { UsersModule } from '../users/users.module';
import { AuditLogModule } from '../audit-logs/audit-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    UsersModule,
    AuditLogModule,
  ],
  providers: [CompaniesRepository, CompaniesService],
  controllers: [CompaniesController],
  exports: [CompaniesRepository],
})
export class CompaniesModule {}
