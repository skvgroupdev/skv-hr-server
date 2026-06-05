import { IsOptional, IsNumberString } from 'class-validator';

export class HolidayQueryDto {
  @IsOptional()
  @IsNumberString()
  year?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
