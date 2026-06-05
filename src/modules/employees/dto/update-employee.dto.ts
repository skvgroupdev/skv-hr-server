import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['initialPassword'] as const),
) {
  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword?: string;
}
