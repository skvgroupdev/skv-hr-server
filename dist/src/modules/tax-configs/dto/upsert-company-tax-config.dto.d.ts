import { TaxMode } from '../schemas/company-tax-config.schema';
export declare class UpsertCompanyTaxConfigDto {
    taxConfigId?: string;
    taxMode?: TaxMode;
    enableEmployeeSs?: boolean;
    enableEmployerSs?: boolean;
    enableIncomeTax?: boolean;
}
