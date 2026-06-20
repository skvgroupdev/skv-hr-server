export interface RefDto {
    id: string;
    name: string;
}
export interface PositionRefDto extends RefDto {
    banding?: string;
}
export interface WorkScheduleDto {
    startTime: string;
    endTime: string;
}
export interface SubscriptionSummaryDto {
    planId: string;
    planName: string;
    status: string;
    endDate: string | null;
    isPaid: boolean;
}
export interface MeResponseDto {
    id: string;
    phone: string;
    name: string;
    role: string;
    companyId: string | null;
    branchId: string | null;
    features?: import('../../plans/schemas/plan.schema').PlanFeatures;
    subscriptionSummary?: SubscriptionSummaryDto;
    employeeId?: string;
    employeeCode?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarUrl?: string;
    bankName?: string;
    bankAccount?: string;
    position?: PositionRefDto;
    department?: RefDto;
    branch?: RefDto;
    startDate?: string;
    employmentType?: string;
    status?: string;
    workSchedule?: WorkScheduleDto;
}
