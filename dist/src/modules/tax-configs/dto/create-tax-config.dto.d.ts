declare class TaxBracketDto {
    from: number;
    to: number | null;
    rate: number;
}
export declare class CreateTaxConfigDto {
    country?: string;
    year: number;
    currency?: string;
    brackets: TaxBracketDto[];
    employeeSsRate?: number;
    employerSsRate?: number;
    effectiveFrom: string;
}
export {};
