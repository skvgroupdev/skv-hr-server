import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdatePayrollPolicyDto {
  @IsEnum(['MONTHLY_FIXED', 'ATTENDANCE_BASED'])
  salaryCalculationMode: 'MONTHLY_FIXED' | 'ATTENDANCE_BASED';

  @IsEnum(['CALENDAR_30', 'SCHEDULED_WORKDAYS'])
  dailyRateMethod: 'CALENDAR_30' | 'SCHEDULED_WORKDAYS';

  @IsBoolean()
  restDayPolicyEnabled: boolean;

  @IsInt()
  @Min(0)
  monthlyRestDays: number;

  @IsBoolean()
  unusedRestDayCompensationEnabled: boolean;

  @IsBoolean()
  unusedRestDaysCarryForward: boolean;

  @IsInt()
  @Min(0)
  lateToleranceMinutes: number;

  @IsInt()
  @Min(0)
  earlyLeaveToleranceMinutes: number;

  @IsBoolean()
  absenceDeductionEnabled: boolean;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}
