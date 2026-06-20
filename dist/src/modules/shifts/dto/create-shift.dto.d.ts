export declare class CreateShiftDto {
    name: string;
    startTime?: string;
    endTime?: string;
    breakStartTime?: string;
    breakEndTime?: string;
    gracePeriodMinutes?: number;
    isOvernight?: boolean;
    workDays?: number[];
    isActive?: boolean;
}
