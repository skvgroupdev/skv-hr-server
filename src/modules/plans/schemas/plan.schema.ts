import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlanDocument = HydratedDocument<Plan>;

export interface PlanFeatures {
  attendance: boolean;
  shiftManagement: boolean;
  attendanceAdjustment: boolean;
  leave: boolean;
  ot: boolean;
  payroll: boolean;
  restDayCompensation: boolean;
  advancedReport: boolean;
  announcement: boolean;
}

export type PlanFeature = keyof PlanFeatures;

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
export class Plan {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: 50 })
  maxEmployees: number;

  @Prop({ default: 3 })
  maxBranches: number;

  @Prop({ default: 5 })
  maxStorageGB: number;

  @Prop({
    type: {
      attendance: { type: Boolean, default: true },
      shiftManagement: { type: Boolean, default: false },
      attendanceAdjustment: { type: Boolean, default: false },
      leave: { type: Boolean, default: true },
      ot: { type: Boolean, default: true },
      payroll: { type: Boolean, default: false },
      restDayCompensation: { type: Boolean, default: false },
      advancedReport: { type: Boolean, default: false },
      announcement: { type: Boolean, default: true },
    },
    default: {},
  })
  features: PlanFeatures;

  @Prop({ default: 30 })
  trialDays: number;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 'LAK' })
  currency: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
