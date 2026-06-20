export declare const COMPANY_SUBSCRIPTION_STATUSES: readonly ["TRIAL", "ACTIVE", "PAST_DUE", "EXPIRED", "CANCELLED", "SUSPENDED"];
export type CompanySubscriptionStatus = (typeof COMPANY_SUBSCRIPTION_STATUSES)[number];
export declare class UpdateSubscriptionDto {
    startDate?: string;
    endDate?: string;
    status?: CompanySubscriptionStatus;
    isPaid?: boolean;
}
export declare class ExtendSubscriptionDto {
    endDate: string;
    isPaid?: boolean;
}
