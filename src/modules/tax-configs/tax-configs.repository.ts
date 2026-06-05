import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaxConfig, TaxConfigDocument } from './schemas/tax-config.schema';
import { CreateTaxConfigDto } from './dto/create-tax-config.dto';

@Injectable()
export class TaxConfigsRepository {
  constructor(@InjectModel(TaxConfig.name) private readonly model: Model<TaxConfigDocument>) {}

  create(dto: CreateTaxConfigDto): Promise<TaxConfigDocument> {
    return this.model.create({ ...dto, effectiveFrom: new Date(dto.effectiveFrom) });
  }

  findAll(): Promise<TaxConfigDocument[]> {
    return this.model.find().sort({ year: -1 }).exec();
  }

  findById(id: string): Promise<TaxConfigDocument | null> {
    return this.model.findById(id).exec();
  }

  findCurrent(country = 'LA'): Promise<TaxConfigDocument | null> {
    return this.model
      .findOne({ country, effectiveFrom: { $lte: new Date() } })
      .sort({ effectiveFrom: -1 })
      .exec();
  }

  update(id: string, data: Partial<TaxConfig>): Promise<TaxConfigDocument | null> {
    return this.model.findByIdAndUpdate(id, data, { returnDocument: 'after' }).exec();
  }
}
