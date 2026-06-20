import type { TaxBracket } from './schemas/tax-config.schema';
export interface OTPolicy {
    weekdayRate: number;
    weekendRate: number;
    holidayRate: number;
}
export interface PayrollInput {
    baseSalary: number;
    allowances: {
        name: string;
        amount: number;
    }[];
    otHours: number;
    otType: 'weekday' | 'weekend' | 'holiday';
    otPolicy: OTPolicy;
    workingHoursPerMonth: number;
    employeeSsRate: number;
    employerSsRate: number;
    brackets: TaxBracket[];
    deductions: {
        name: string;
        amount: number;
    }[];
}
export interface PayrollResult {
    baseSalary: number;
    allowancesTotal: number;
    otAmount: number;
    grossSalary: number;
    employeeSsAmount: number;
    taxableIncome: number;
    incomeTax: number;
    otherDeductionsTotal: number;
    totalDeductions: number;
    netSalary: number;
    employerSsAmount: number;
}
export declare class TaxCalculationService {
    calculateProgressiveTax(taxableIncome: number, brackets: TaxBracket[]): number;
    calculateOTAmount(baseSalary: number, workingHoursPerMonth: number, otHours: number, otType: 'weekday' | 'weekend' | 'holiday', otPolicy: OTPolicy): number;
    calculatePayroll(input: PayrollInput): PayrollResult;
}
