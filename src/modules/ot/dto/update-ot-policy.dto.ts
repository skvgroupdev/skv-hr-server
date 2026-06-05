import { IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class UpdateOTPolicyDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  weekdayRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  weekendRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  holidayRate?: number;

  @IsOptional()
  @IsBoolean()
  beforeWorkAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  afterWorkAllowed?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minOtMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(24)
  maxOtHoursPerDay?: number;

  @IsOptional()
  @IsBoolean()
  requirePreApproval?: boolean;

  @IsOptional()
  @IsBoolean()
  compareWithCheckout?: boolean;
}
