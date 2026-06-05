import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OTPolicyDocument = HydratedDocument<OTPolicy>;

@Schema({
  timestamps: { createdAt: false, updatedAt: true },
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      delete ret._id;
    },
  },
})
export class OTPolicy {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true, unique: true })
  tenantId: Types.ObjectId;

  @Prop({ default: 1.5 })
  weekdayRate: number;

  @Prop({ default: 2.0 })
  weekendRate: number;

  @Prop({ default: 3.0 })
  holidayRate: number;

  @Prop({ default: true })
  beforeWorkAllowed: boolean;

  @Prop({ default: true })
  afterWorkAllowed: boolean;

  @Prop({ default: 30 })
  minOtMinutes: number;

  @Prop({ default: 4 })
  maxOtHoursPerDay: number;

  @Prop({ default: true })
  requirePreApproval: boolean;

  @Prop({ default: false })
  compareWithCheckout: boolean;
}

export const OTPolicySchema = SchemaFactory.createForClass(OTPolicy);
