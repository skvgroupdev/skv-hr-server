import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class AdjustAttendanceDto {
  @IsOptional()
  @IsEnum(['CHECK_IN', 'CHECK_OUT', 'BREAK_IN', 'BREAK_OUT', 'MANUAL_ADJUSTMENT'])
  type?: string;

  @IsOptional()
  @IsDateString()
  checkTime?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsString()
  reason: string;
}
