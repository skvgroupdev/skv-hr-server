import { IsString, IsDateString } from 'class-validator';

export class CreateOTRequestDto {
  @IsDateString()
  date: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  reason: string;
}
