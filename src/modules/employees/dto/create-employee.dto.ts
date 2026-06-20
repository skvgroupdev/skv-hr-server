import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEmail,
  IsUrl,
  Min,
  IsPhoneNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class EmergencyContactDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  relation: string;
}

class AllowanceDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  amount: number;
}

export class CreateEmployeeDto {
  // Identity
  @IsOptional()
  @IsString()
  employeeCode?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  firstNameEn?: string;

  @IsOptional()
  @IsString()
  lastNameEn?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender?: 'MALE' | 'FEMALE' | 'OTHER';

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  // Employment
  @IsOptional()
  @IsEnum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'])
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  probationEndDate?: string;

  // Organization
  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  positionId?: string;

  @IsOptional()
  @IsString()
  managerId?: string;

  @IsOptional()
  @IsString()
  supervisorId?: string;

  // Salary
  @IsOptional()
  @IsNumber()
  @Min(0)
  baseSalary?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllowanceDto)
  allowances?: AllowanceDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  workingHoursPerMonth?: number;

  @IsOptional()
  @IsString()
  bankAccount?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  // Role assignment
  @IsOptional()
  @IsEnum(['HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR', 'STAFF'])
  role?: 'HR_ADMIN' | 'BRANCH_MANAGER' | 'SUPERVISOR' | 'STAFF';

  // Auto-create user account
  @IsOptional()
  @IsString()
  initialPassword?: string;
}
