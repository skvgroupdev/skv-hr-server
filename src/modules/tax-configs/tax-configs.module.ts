import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaxConfig, TaxConfigSchema } from './schemas/tax-config.schema';
import { CompanyTaxConfig, CompanyTaxConfigSchema } from './schemas/company-tax-config.schema';
import { TaxConfigsRepository } from './tax-configs.repository';
import { CompanyTaxConfigsRepository } from './company-tax-configs.repository';
import { TaxConfigsService } from './tax-configs.service';
import { TaxConfigsController } from './tax-configs.controller';
import { TaxCalculationService } from './tax-calculation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaxConfig.name, schema: TaxConfigSchema },
      { name: CompanyTaxConfig.name, schema: CompanyTaxConfigSchema },
    ]),
  ],
  providers: [TaxConfigsRepository, CompanyTaxConfigsRepository, TaxConfigsService, TaxCalculationService],
  controllers: [TaxConfigsController],
  exports: [TaxConfigsRepository, CompanyTaxConfigsRepository, TaxConfigsService, TaxCalculationService],
})
export class TaxConfigsModule {}
