import { IsString, IsNumber, IsArray, IsDateString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TaxBracketDto {
  @IsNumber()
  from: number;

  @IsNumber()
  to: number | null;

  @IsNumber()
  rate: number;
}

export class CreateTaxConfigDto {
  @IsOptional()
  @IsString()
  country?: string;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxBracketDto)
  brackets: TaxBracketDto[];

  @IsOptional()
  @IsNumber()
  employeeSsRate?: number;

  @IsOptional()
  @IsNumber()
  employerSsRate?: number;

  @IsDateString()
  effectiveFrom: string;
}
