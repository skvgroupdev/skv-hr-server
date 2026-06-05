import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OTRequestDocument = HydratedDocument<OTRequest>;

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
export class OTRequest {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ default: 0 })
  totalHours: number;

  @Prop({ type: String, enum: ['weekday', 'weekend', 'holiday'], default: 'weekday' })
  dayType?: string;

  @Prop({ required: true })
  reason: string;

  @Prop({
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

  @Prop({
    type: [
      {
        approverId: { type: Types.ObjectId, ref: 'User' },
        role: String,
        status: String,
        comment: String,
        approvedAt: Date,
      },
    ],
    default: [],
  })
  approvalFlow: Array<{
    approverId: Types.ObjectId;
    role: string;
    status: string;
    comment?: string;
    approvedAt?: Date;
  }>;
}

export const OTRequestSchema = SchemaFactory.createForClass(OTRequest);
OTRequestSchema.index({ tenantId: 1, employeeId: 1 });
OTRequestSchema.index({ tenantId: 1, status: 1 });
