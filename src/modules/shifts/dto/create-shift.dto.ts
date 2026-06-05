import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsInt, Min, Max, Matches } from 'class-validator';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateShiftDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_REGEX, { message: 'startTime must be HH:mm format' })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_REGEX, { message: 'endTime must be HH:mm format' })
  endTime?: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_REGEX, { message: 'breakStartTime must be HH:mm format' })
  breakStartTime?: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_REGEX, { message: 'breakEndTime must be HH:mm format' })
  breakEndTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gracePeriodMinutes?: number;

  @IsOptional()
  @IsBoolean()
  isOvernight?: boolean;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  workDays?: number[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
