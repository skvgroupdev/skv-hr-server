export declare class UpdateOTPolicyDto {
    weekdayRate?: number;
    weekendRate?: number;
    holidayRate?: number;
    beforeWorkAllowed?: boolean;
    afterWorkAllowed?: boolean;
    minOtMinutes?: number;
    maxOtHoursPerDay?: number;
    requirePreApproval?: boolean;
    compareWithCheckout?: boolean;
}
