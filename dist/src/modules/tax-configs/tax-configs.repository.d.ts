import { Model } from 'mongoose';
import { TaxConfig, TaxConfigDocument } from './schemas/tax-config.schema';
import { CreateTaxConfigDto } from './dto/create-tax-config.dto';
export declare class TaxConfigsRepository {
    private readonly model;
    constructor(model: Model<TaxConfigDocument>);
    create(dto: CreateTaxConfigDto): Promise<TaxConfigDocument>;
    findAll(): Promise<TaxConfigDocument[]>;
    findById(id: string): Promise<TaxConfigDocument | null>;
    findCurrent(country?: string): Promise<TaxConfigDocument | null>;
    update(id: string, data: Partial<TaxConfig>): Promise<TaxConfigDocument | null>;
}
