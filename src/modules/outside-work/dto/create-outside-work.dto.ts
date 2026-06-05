import { IsString, IsEnum, IsOptional, IsNumber, IsArray, Min, Max } from 'class-validator';

export class CreateOutsideWorkDto {
  @IsEnum(['OUTSIDE_WORK', 'CUSTOMER_VISIT', 'DELIVERY', 'WORK_FROM_HOME', 'BUSINESS_TRIP', 'EMERGENCY', 'OTHER'])
  outsideType: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  @IsOptional()
  @IsNumber()
  gpsAccuracy?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];

  @IsOptional()
  @IsString()
  attendanceLogId?: string;
}
