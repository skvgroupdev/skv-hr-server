import {
  IsMongoId,
  IsArray,
  IsDateString,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';

export class BulkAssignShiftDto {
  @IsMongoId()
  shiftId: string;

  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  employeeIds: string[];

  @IsDateString()
  effectiveDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
