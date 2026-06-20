import { IsOptional, IsDateString, IsNumberString, IsString, IsNotEmpty } from 'class-validator';

export class AttendanceHistoryQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class AttendanceReportQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsNumberString()
  month?: string;

  @IsOptional()
  @IsNumberString()
  year?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class EmployeeMonthlyReportQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  year!: string;

  @IsNotEmpty()
  @IsNumberString()
  month!: string;
}
