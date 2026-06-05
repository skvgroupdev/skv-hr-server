import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaxConfigDocument = HydratedDocument<TaxConfig>;

export interface TaxBracket {
  from: number;
  to: number | null;
  rate: number;
}

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      delete ret._id;
    },
  },
})
export class TaxConfig {
  @Prop({ default: 'LA' })
  country: string;

  @Prop({ required: true })
  year: number;

  @Prop({ default: 'LAK' })
  currency: string;

  @Prop({
    type: [{ from: Number, to: Number, rate: Number }],
    required: true,
  })
  brackets: TaxBracket[];

  @Prop({ default: 0.055 })
  employeeSsRate: number;

  @Prop({ default: 0.06 })
  employerSsRate: number;

  @Prop({ required: true })
  effectiveFrom: Date;
}

export const TaxConfigSchema = SchemaFactory.createForClass(TaxConfig);
TaxConfigSchema.index({ country: 1, year: -1 });
