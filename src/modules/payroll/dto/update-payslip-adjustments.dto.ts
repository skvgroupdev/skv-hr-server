import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PayrollAdjustmentDto {
  @IsEnum(['ADDITION', 'DEDUCTION'])
  kind: 'ADDITION' | 'DEDUCTION';

  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @MinLength(3)
  reason: string;
}

export class UpdatePayslipAdjustmentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PayrollAdjustmentDto)
  adjustments: PayrollAdjustmentDto[];
}
