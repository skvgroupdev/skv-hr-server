import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

class UniformScheduleDto {
  @IsString()
  @Matches(TIME_PATTERN)
  startTime: string;

  @IsString()
  @Matches(TIME_PATTERN)
  endTime: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_PATTERN)
  breakStartTime?: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_PATTERN)
  breakEndTime?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  workDays: number[];

  @IsInt()
  @Min(0)
  gracePeriodMinutes: number;

  @IsBoolean()
  isOvernight: boolean;
}

export class UpdateAttendancePolicyDto {
  @IsEnum(['UNIFORM', 'SHIFT_BASED'])
  workScheduleMode: 'UNIFORM' | 'SHIFT_BASED';

  @IsOptional()
  @ValidateNested()
  @Type(() => UniformScheduleDto)
  uniformSchedule?: UniformScheduleDto;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}
