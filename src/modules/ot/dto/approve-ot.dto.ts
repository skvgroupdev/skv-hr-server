import { IsOptional, IsString } from 'class-validator';

export class ApproveOTDto {
  @IsOptional()
  @IsString()
  comment?: string;
}

export class RejectOTDto {
  @IsString()
  reason: string;
}
