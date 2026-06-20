declare class PayrollAdjustmentDto {
    kind: 'ADDITION' | 'DEDUCTION';
    name: string;
    amount: number;
    reason: string;
}
export declare class UpdatePayslipAdjustmentsDto {
    adjustments: PayrollAdjustmentDto[];
}
export {};
