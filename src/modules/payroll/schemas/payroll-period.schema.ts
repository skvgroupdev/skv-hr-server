import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PayrollPeriodDocument = HydratedDocument<PayrollPeriod>;

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
export class PayrollPeriod {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    type: String,
    // APPROVED and LOCKED are deprecated (kept for backward compat with existing DB docs)
    // Active workflow: DRAFT → GENERATED → HR_REVIEWED → PAID
    enum: ['DRAFT', 'GENERATED', 'HR_REVIEWED', 'PAID', 'APPROVED', 'LOCKED'],
    default: 'DRAFT',
  })
  status:
    | 'DRAFT'
    | 'GENERATED'
    | 'HR_REVIEWED'
    | 'PAID'
    | 'APPROVED' // @deprecated
    | 'LOCKED'; // @deprecated

  @Prop({ type: Types.ObjectId, ref: 'User' })
  generatedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  hrReviewedBy?: Types.ObjectId;

  @Prop()
  hrReviewedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  paidBy?: Types.ObjectId;

  @Prop()
  paidAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  lockedBy?: Types.ObjectId;
}

export const PayrollPeriodSchema = SchemaFactory.createForClass(PayrollPeriod);
PayrollPeriodSchema.index({ tenantId: 1 });
