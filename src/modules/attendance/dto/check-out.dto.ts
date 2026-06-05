import { IsBoolean, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CheckOutDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @IsOptional()
  @IsNumber()
  gpsAccuracy?: number;

  @IsOptional()
  @IsString()
  selfieUrl?: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  earlyLeaveReason?: string;

  @IsOptional()
  @IsBoolean()
  isOffsite?: boolean;
}
