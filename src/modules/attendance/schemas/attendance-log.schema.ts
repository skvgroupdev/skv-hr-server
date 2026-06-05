import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AttendanceLogDocument = HydratedDocument<AttendanceLog>;

export type AttendanceType = 'CHECK_IN' | 'CHECK_OUT' | 'BREAK_IN' | 'BREAK_OUT' | 'MANUAL_ADJUSTMENT';

export type AttendanceStatus =
  | 'NORMAL'
  | 'LATE_MINOR'
  | 'LATE'
  | 'EARLY_LEAVE'
  | 'ABSENT'
  | 'MISSING_CHECKOUT'
  | 'OUTSIDE_PENDING'
  | 'OUTSIDE_APPROVED'
  | 'OUTSIDE_REJECTED'
  | 'MANUAL_ADJUSTED';

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
export class AttendanceLog {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch' })
  branchId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['CHECK_IN', 'CHECK_OUT', 'BREAK_IN', 'BREAK_OUT', 'MANUAL_ADJUSTMENT'],
    required: true,
  })
  type: AttendanceType;

  @Prop({ required: true })
  checkTime: Date;

  @Prop({ required: true })
  serverTime: Date;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: [Number],
  })
  location?: { type: 'Point'; coordinates: [number, number] };

  @Prop()
  gpsAccuracy?: number;

  @Prop()
  distanceFromBranch?: number;

  @Prop()
  isInsideGeofence?: boolean;

  @Prop()
  selfieUrl?: string;

  @Prop()
  deviceId?: string;

  @Prop()
  ipAddress?: string;

  @Prop({
    type: String,
    enum: ['NORMAL', 'LATE_MINOR', 'LATE', 'EARLY_LEAVE', 'ABSENT', 'MISSING_CHECKOUT', 'OUTSIDE_PENDING', 'OUTSIDE_APPROVED', 'OUTSIDE_REJECTED', 'MANUAL_ADJUSTED'],
    default: 'NORMAL',
  })
  status: AttendanceStatus;

  @Prop({ type: Number, default: 0 })
  lateMinutes: number;

  @Prop()
  note?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  adjustedBy?: Types.ObjectId;

  @Prop()
  adjustReason?: string;

  @Prop({ type: String })
  earlyLeaveReason?: string;
}

export const AttendanceLogSchema = SchemaFactory.createForClass(AttendanceLog);
AttendanceLogSchema.index({ tenantId: 1, employeeId: 1, checkTime: -1 });
AttendanceLogSchema.index({ location: '2dsphere' }, { sparse: true });
