import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShiftDocument = HydratedDocument<Shift>;

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
export class Shift {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  startTime?: string; // "08:00"

  @Prop()
  endTime?: string; // "17:00"

  @Prop()
  breakStartTime?: string;

  @Prop()
  breakEndTime?: string;

  @Prop({ default: 15 })
  gracePeriodMinutes: number;

  @Prop({ default: false })
  isOvernight: boolean;

  @Prop({ type: [Number], default: [1, 2, 3, 4, 5] })
  workDays: number[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);
ShiftSchema.index({ tenantId: 1 });
