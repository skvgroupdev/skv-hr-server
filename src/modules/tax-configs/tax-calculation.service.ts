import { Injectable } from '@nestjs/common';
import type { TaxBracket } from './schemas/tax-config.schema';

export interface OTPolicy {
  weekdayRate: number;
  weekendRate: number;
  holidayRate: number;
}

export interface PayrollInput {
  baseSalary: number;
  allowances: { name: string; amount: number }[];
  otHours: number;
  otType: 'weekday' | 'weekend' | 'holiday';
  otPolicy: OTPolicy;
  workingHoursPerMonth: number;
  employeeSsRate: number;
  employerSsRate: number;
  brackets: TaxBracket[];
  deductions: { name: string; amount: number }[];
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

@Injectable()
export class TaxCalculationService {
  calculateProgressiveTax(taxableIncome: number, brackets: TaxBracket[]): number {
    let tax = 0;
    for (const bracket of brackets) {
      if (taxableIncome <= 0) break;
      const from = bracket.from;
      const to = bracket.to ?? Infinity;
      if (taxableIncome <= from) break;
      const taxableInBracket = Math.min(taxableIncome, to) - from;
      tax += taxableInBracket * bracket.rate;
    }
    return Math.round(tax);
  }

  calculateOTAmount(
    baseSalary: number,
    workingHoursPerMonth: number,
    otHours: number,
    otType: 'weekday' | 'weekend' | 'holiday',
    otPolicy: OTPolicy,
  ): number {
    const hourlyRate = baseSalary / workingHoursPerMonth;
    const otRateMap = {
      weekday: otPolicy.weekdayRate,
      weekend: otPolicy.weekendRate,
      holiday: otPolicy.holidayRate,
    };
    return hourlyRate * otHours * otRateMap[otType];
  }

  calculatePayroll(input: PayrollInput): PayrollResult {
    const allowancesTotal = input.allowances.reduce((sum, a) => sum + a.amount, 0);
    const otAmount = this.calculateOTAmount(
      input.baseSalary,
      input.workingHoursPerMonth,
      input.otHours,
      input.otType,
      input.otPolicy,
    );

    const grossSalary = input.baseSalary + allowancesTotal + otAmount;
    const employeeSsAmount = Math.round(grossSalary * input.employeeSsRate);
    const taxableIncome = grossSalary - employeeSsAmount;
    const incomeTax = this.calculateProgressiveTax(taxableIncome, input.brackets);
    const otherDeductionsTotal = input.deductions.reduce((sum, d) => sum + d.amount, 0);
    const totalDeductions = employeeSsAmount + incomeTax + otherDeductionsTotal;
    const netSalary = grossSalary - totalDeductions;
    const employerSsAmount = Math.round(grossSalary * input.employerSsRate);

    return {
      baseSalary: input.baseSalary,
      allowancesTotal,
      otAmount: Math.round(otAmount),
      grossSalary: Math.round(grossSalary),
      employeeSsAmount,
      taxableIncome: Math.round(taxableIncome),
      incomeTax,
      otherDeductionsTotal,
      totalDeductions,
      netSalary: Math.round(netSalary),
      employerSsAmount,
    };
  }
}
