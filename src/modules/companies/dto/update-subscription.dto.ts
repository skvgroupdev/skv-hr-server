import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
} from 'class-validator';

export const COMPANY_SUBSCRIPTION_STATUSES = [
  'TRIAL',
  'ACTIVE',
  'PAST_DUE',
  'EXPIRED',
  'CANCELLED',
  'SUSPENDED',
] as const;

export type CompanySubscriptionStatus =
  (typeof COMPANY_SUBSCRIPTION_STATUSES)[number];

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsIn(COMPANY_SUBSCRIPTION_STATUSES)
  status?: CompanySubscriptionStatus;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}

export class ExtendSubscriptionDto {
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
