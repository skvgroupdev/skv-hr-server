import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  level?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  banding?: string;
}
