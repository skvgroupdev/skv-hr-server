import { IsString, IsDateString, IsOptional, IsBoolean, IsEnum, IsArray, ValidateIf } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsOptional()
  @IsString()
  leaveTypeId?: string;

  @IsOptional()
  @IsString()
  leaveTypeName?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;

  @IsOptional()
  @IsEnum(['AM', 'PM'])
  halfDayPeriod?: 'AM' | 'PM';

  @IsString()
  reason: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachmentUrls?: string[];
}
