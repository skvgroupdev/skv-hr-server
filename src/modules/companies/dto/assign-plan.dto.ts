import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class AssignPlanDto {
  @IsMongoId()
  planId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
