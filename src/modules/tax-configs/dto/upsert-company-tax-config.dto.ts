import { IsOptional, IsMongoId, IsEnum, IsBoolean } from 'class-validator';
import { TaxMode } from '../schemas/company-tax-config.schema';

export class UpsertCompanyTaxConfigDto {
  @IsOptional()
  @IsMongoId()
  taxConfigId?: string;

  @IsOptional()
  @IsEnum(TaxMode)
  taxMode?: TaxMode;

  @IsOptional()
  @IsBoolean()
  enableEmployeeSs?: boolean;

  @IsOptional()
  @IsBoolean()
  enableEmployerSs?: boolean;

  @IsOptional()
  @IsBoolean()
  enableIncomeTax?: boolean;
}
