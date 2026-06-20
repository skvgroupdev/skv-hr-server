import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PlanFeaturesDto {
  @IsOptional()
  @IsBoolean()
  attendance?: boolean;

  @IsOptional()
  @IsBoolean()
  shiftManagement?: boolean;

  @IsOptional()
  @IsBoolean()
  attendanceAdjustment?: boolean;

  @IsOptional()
  @IsBoolean()
  leave?: boolean;

  @IsOptional()
  @IsBoolean()
  ot?: boolean;

  @IsOptional()
  @IsBoolean()
  payroll?: boolean;

  @IsOptional()
  @IsBoolean()
  restDayCompensation?: boolean;

  @IsOptional()
  @IsBoolean()
  advancedReport?: boolean;

  @IsOptional()
  @IsBoolean()
  announcement?: boolean;
}

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxEmployees?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxBranches?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxStorageGB?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => PlanFeaturesDto)
  features?: PlanFeaturesDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  trialDays?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
