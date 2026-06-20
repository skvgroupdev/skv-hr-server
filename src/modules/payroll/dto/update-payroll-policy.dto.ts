import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdatePayrollPolicyDto {
  @IsOptional()
  @IsBoolean()
  restDayPolicyEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  monthlyRestDays?: number;

  @IsOptional()
  @IsBoolean()
  unusedRestDayCompensationEnabled?: boolean;
}
