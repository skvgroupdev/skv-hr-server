import { IsOptional, IsNumberString, IsString, IsEnum } from 'class-validator';
import type { EmployeeStatus } from '../schemas/employee.schema';

export class EmployeeQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'PROBATION', 'RESIGNED', 'SUSPENDED', 'TERMINATED'])
  status?: EmployeeStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
