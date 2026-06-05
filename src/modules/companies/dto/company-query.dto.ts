import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class CompanyQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  sort?: string;
}
