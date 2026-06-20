declare class UniformScheduleDto {
    startTime: string;
    endTime: string;
    breakStartTime?: string;
    breakEndTime?: string;
    workDays: number[];
    gracePeriodMinutes: number;
    isOvernight: boolean;
}
export declare class UpdateAttendancePolicyDto {
    workScheduleMode: 'UNIFORM' | 'SHIFT_BASED';
    uniformSchedule?: UniformScheduleDto;
    effectiveFrom?: string;
}
export {};
