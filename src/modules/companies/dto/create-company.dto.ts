import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsMongoId,
  Matches,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  // Optional: 3–5 uppercase letters. Auto-generated from name if omitted.
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3,5}$/, { message: 'companyCode must be 3–5 uppercase letters' })
  companyCode?: string;

  @IsOptional()
  @IsUrl()
  logo?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  defaultLanguage?: string;

  @IsOptional()
  @IsString()
  defaultTimezone?: string;

  @IsOptional()
  @IsMongoId()
  planId?: string;
}
