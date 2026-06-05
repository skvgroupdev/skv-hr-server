import { IsString, IsDateString, IsOptional } from 'class-validator';

export class AssignShiftDto {
  @IsString()
  employeeId: string;

  @IsDateString()
  effectiveDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
