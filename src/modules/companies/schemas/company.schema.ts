import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

export type CompanyStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED';

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
export class Company {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  logo?: string;

  @Prop()
  taxId?: string;

  @Prop()
  address?: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop({ default: 'th' })
  defaultLanguage: string;

  @Prop({ default: 'Asia/Vientiane' })
  defaultTimezone: string;

  @Prop({
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'TRIAL', 'EXPIRED'],
    default: 'TRIAL',
  })
  status: CompanyStatus;

  // Subscription fields (Phase 6)
  @Prop({ type: Types.ObjectId, ref: 'Plan', default: null })
  planId: Types.ObjectId | null;

  @Prop({
    type: {
      startDate: Date,
      endDate: Date,
      status: { type: String, enum: ['TRIAL', 'ACTIVE', 'EXPIRED', 'SUSPENDED'], default: 'TRIAL' },
      isPaid: { type: Boolean, default: false },
    },
    default: {},
  })
  subscription: {
    startDate?: Date;
    endDate?: Date;
    status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
    isPaid: boolean;
  };
}

export const CompanySchema = SchemaFactory.createForClass(Company);
