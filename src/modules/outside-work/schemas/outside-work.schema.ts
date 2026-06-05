import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OutsideWorkDocument = HydratedDocument<OutsideWork>;

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
export class OutsideWork {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee' })
  managerId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AttendanceLog' })
  attendanceLogId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['OUTSIDE_WORK', 'CUSTOMER_VISIT', 'DELIVERY', 'WORK_FROM_HOME', 'BUSINESS_TRIP', 'EMERGENCY', 'OTHER'],
    required: true,
  })
  outsideType: string;

  @Prop({ required: true })
  reason: string;

  @Prop()
  locationName?: string;

  @Prop({ type: Object })
  location?: { type: 'Point'; coordinates: [number, number] };

  @Prop()
  gpsAccuracy?: number;

  @Prop({ type: [String], default: [] })
  photoUrls: string[];

  @Prop({
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop()
  approvedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy?: Types.ObjectId;

  @Prop()
  rejectedAt?: Date;

  @Prop()
  rejectReason?: string;
}

export const OutsideWorkSchema = SchemaFactory.createForClass(OutsideWork);
OutsideWorkSchema.index({ tenantId: 1, employeeId: 1 });
OutsideWorkSchema.index({ tenantId: 1, status: 1 });
