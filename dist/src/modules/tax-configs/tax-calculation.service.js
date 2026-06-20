"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxCalculationService = void 0;
const common_1 = require("@nestjs/common");
let TaxCalculationService = class TaxCalculationService {
    calculateProgressiveTax(taxableIncome, brackets) {
        let tax = 0;
        for (const bracket of brackets) {
            if (taxableIncome <= 0)
                break;
            const from = bracket.from;
            const to = bracket.to ?? Infinity;
            if (taxableIncome <= from)
                break;
            const taxableInBracket = Math.min(taxableIncome, to) - from;
            tax += taxableInBracket * bracket.rate;
        }
        return Math.round(tax);
    }
    calculateOTAmount(baseSalary, workingHoursPerMonth, otHours, otType, otPolicy) {
        const hourlyRate = baseSalary / workingHoursPerMonth;
        const otRateMap = {
            weekday: otPolicy.weekdayRate,
            weekend: otPolicy.weekendRate,
            holiday: otPolicy.holidayRate,
        };
        return hourlyRate * otHours * otRateMap[otType];
    }
    calculatePayroll(input) {
        const allowancesTotal = input.allowances.reduce((sum, a) => sum + a.amount, 0);
        const otAmount = this.calculateOTAmount(input.baseSalary, input.workingHoursPerMonth, input.otHours, input.otType, input.otPolicy);
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
};
exports.TaxCalculationService = TaxCalculationService;
exports.TaxCalculationService = TaxCalculationService = __decorate([
    (0, common_1.Injectable)()
], TaxCalculationService);
//# sourceMappingURL=tax-calculation.service.js.map