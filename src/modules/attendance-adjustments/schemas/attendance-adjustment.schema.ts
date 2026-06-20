import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AttendanceAdjustmentDocument =
  HydratedDocument<AttendanceAdjustment>;

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
export class AttendanceAdjustment {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AttendanceLog' })
  attendanceLogId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AttendanceLog' })
  correctionLogId?: Types.ObjectId;

  @Prop({ type: String, enum: ['CHECK_IN', 'CHECK_OUT'], required: true })
  type: 'CHECK_IN' | 'CHECK_OUT';

  @Prop({ required: true })
  workDate: Date;

  @Prop()
  originalCheckTime?: Date;

  @Prop({ required: true })
  requestedCheckTime: Date;

  @Prop({ required: true, trim: true })
  reason: string;

  @Prop()
  evidenceUrl?: string;

  @Prop({
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewComment?: string;

  @Prop()
  reviewedAt?: Date;
}

export const AttendanceAdjustmentSchema =
  SchemaFactory.createForClass(AttendanceAdjustment);
AttendanceAdjustmentSchema.index({ tenantId: 1, employeeId: 1, createdAt: -1 });
AttendanceAdjustmentSchema.index({
  tenantId: 1,
  branchId: 1,
  status: 1,
  createdAt: -1,
});
AttendanceAdjustmentSchema.index(
  { tenantId: 1, employeeId: 1, workDate: 1, type: 1 },
  { unique: true, partialFilterExpression: { status: 'PENDING' } },
);
