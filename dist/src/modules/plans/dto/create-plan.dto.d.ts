declare class PlanFeaturesDto {
    attendance?: boolean;
    shiftManagement?: boolean;
    attendanceAdjustment?: boolean;
    outsideWork?: boolean;
    leave?: boolean;
    ot?: boolean;
    payroll?: boolean;
    restDayCompensation?: boolean;
    advancedReport?: boolean;
    announcement?: boolean;
}
export declare class CreatePlanDto {
    name: string;
    description?: string;
    maxEmployees?: number;
    maxBranches?: number;
    maxStorageGB?: number;
    features?: PlanFeaturesDto;
    trialDays?: number;
    price?: number;
    currency?: string;
}
export {};
