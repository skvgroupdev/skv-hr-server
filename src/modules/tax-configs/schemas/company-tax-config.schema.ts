import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CompanyTaxConfigDocument = HydratedDocument<CompanyTaxConfig>;

export enum TaxMode {
  FULL_DEDUCTION = 'FULL_DEDUCTION',
  TAX_ON_COMPANY = 'TAX_ON_COMPANY',
  SS_ONLY = 'SS_ONLY',
  NO_DEDUCTION = 'NO_DEDUCTION',
}

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      delete ret._id;
    },
  },
})
export class CompanyTaxConfig {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true, unique: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'TaxConfig', required: true })
  taxConfigId: Types.ObjectId;

  @Prop({ type: String, enum: TaxMode, default: TaxMode.FULL_DEDUCTION })
  taxMode: TaxMode;

  @Prop({ default: true })
  enableEmployeeSs: boolean;

  @Prop({ default: true })
  enableEmployerSs: boolean;

  @Prop({ default: true })
  enableIncomeTax: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const CompanyTaxConfigSchema = SchemaFactory.createForClass(CompanyTaxConfig);
