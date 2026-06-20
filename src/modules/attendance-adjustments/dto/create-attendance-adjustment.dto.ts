import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateAttendanceAdjustmentDto {
  @IsOptional()
  @IsMongoId()
  attendanceLogId?: string;

  @IsEnum(['CHECK_IN', 'CHECK_OUT'])
  type: 'CHECK_IN' | 'CHECK_OUT';

  @IsDateString()
  workDate: string;

  @IsDateString()
  requestedCheckTime: string;

  @IsString()
  @MinLength(3)
  reason: string;

  @IsOptional()
  @IsUrl()
  evidenceUrl?: string;
}
