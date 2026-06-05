import { IsString, IsNumber, IsOptional, IsNumberString } from 'class-validator';

export class LeaveBalanceAdjustDto {
  @IsString()
  leaveTypeId: string;

  @IsNumber()
  adjustment: number;

  @IsOptional()
  @IsNumber()
  year?: number;
}
