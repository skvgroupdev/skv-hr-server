import { IsOptional, IsString } from 'class-validator';

export class ApproveLeaveDto {
  @IsOptional()
  @IsString()
  comment?: string;
}

export class RejectLeaveDto {
  @IsString()
  reason: string;
}
