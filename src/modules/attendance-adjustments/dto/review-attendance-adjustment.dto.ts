import { IsOptional, IsString, MinLength } from 'class-validator';

export class ReviewAttendanceAdjustmentDto {
  @IsOptional()
  @IsString()
  comment?: string;
}

export class RejectAttendanceAdjustmentDto {
  @IsString()
  @MinLength(3)
  reason: string;
}
