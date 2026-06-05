import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LeaveTypeDocument = HydratedDocument<LeaveType>;

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
export class LeaveType {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  code: string;

  @Prop({ default: 0 })
  defaultDaysPerYear: number;

  @Prop({ default: true })
  isPaid: boolean;

  @Prop({ default: false })
  requireAttachment: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const LeaveTypeSchema = SchemaFactory.createForClass(LeaveType);
LeaveTypeSchema.index({ tenantId: 1 });
LeaveTypeSchema.index({ tenantId: 1, code: 1 }, { unique: true });
