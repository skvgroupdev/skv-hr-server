import { IsString, IsOptional, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'phone must be in E.164 format e.g. +85620123456' })
  phone: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  companyCode?: string;
}
