import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompanyPolicy,
  CompanyPolicySchema,
} from './schemas/company-policy.schema';
import { CompanyPoliciesRepository } from './company-policies.repository';
import { CompanyPoliciesService } from './company-policies.service';
import { CompanyPoliciesController } from './company-policies.controller';
import { CompaniesModule } from '../companies/companies.module';
import { PlansModule } from '../plans/plans.module';
import { AuditLogModule } from '../audit-logs/audit-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompanyPolicy.name, schema: CompanyPolicySchema },
    ]),
    CompaniesModule,
    PlansModule,
    AuditLogModule,
  ],
  providers: [CompanyPoliciesRepository, CompanyPoliciesService],
  controllers: [CompanyPoliciesController],
  exports: [CompanyPoliciesRepository, CompanyPoliciesService],
})
export class CompanyPoliciesModule {}
