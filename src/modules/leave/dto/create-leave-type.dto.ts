import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
} from 'class-validator';

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
  @IsEnum(['LEAVE', 'REST_DAY'])
  category?: 'LEAVE' | 'REST_DAY';

  @IsOptional()
  @IsBoolean()
  requireAttachment?: boolean;
}
