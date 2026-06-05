import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultDaysPerYear?: number;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsBoolean()
  requireAttachment?: boolean;
}
