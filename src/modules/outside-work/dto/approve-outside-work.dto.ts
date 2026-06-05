import { IsOptional, IsString } from 'class-validator';

export class ApproveOutsideWorkDto {
  @IsOptional()
  @IsString()
  comment?: string;
}

export class RejectOutsideWorkDto {
  @IsString()
  reason: string;
}
