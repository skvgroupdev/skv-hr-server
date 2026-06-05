import { IsString, IsDateString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

export class CreateHolidayDto {
  @IsString()
  name: string;

  @IsDateString()
  date: string;

  @IsEnum(['PUBLIC', 'COMPANY'])
  type: 'PUBLIC' | 'COMPANY';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
