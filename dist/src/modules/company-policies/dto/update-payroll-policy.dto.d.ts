export declare class UpdatePayrollPolicyDto {
    salaryCalculationMode: 'MONTHLY_FIXED' | 'ATTENDANCE_BASED';
    dailyRateMethod: 'CALENDAR_30' | 'SCHEDULED_WORKDAYS';
    restDayPolicyEnabled: boolean;
    monthlyRestDays: number;
    unusedRestDayCompensationEnabled: boolean;
    unusedRestDaysCarryForward: boolean;
    lateToleranceMinutes: number;
    earlyLeaveToleranceMinutes: number;
    absenceDeductionEnabled: boolean;
    effectiveFrom?: string;
}
