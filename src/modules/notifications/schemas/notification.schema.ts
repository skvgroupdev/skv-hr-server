import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export type NotificationType =
  | 'LEAVE_REQUEST' | 'LEAVE_APPROVED' | 'LEAVE_REJECTED'
  | 'OT_REQUEST' | 'OT_APPROVED' | 'OT_REJECTED'
  | 'OUTSIDE_WORK_REQUEST' | 'OUTSIDE_WORK_APPROVED' | 'OUTSIDE_WORK_REJECTED'
  | 'ATTENDANCE_LATE' | 'PAYROLL_RELEASED' | 'ANNOUNCEMENT' | 'SUBSCRIPTION_EXPIRING';

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
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({
    type: String,
    enum: [
      'LEAVE_REQUEST', 'LEAVE_APPROVED', 'LEAVE_REJECTED',
      'OT_REQUEST', 'OT_APPROVED', 'OT_REJECTED',
      'OUTSIDE_WORK_REQUEST', 'OUTSIDE_WORK_APPROVED', 'OUTSIDE_WORK_REJECTED',
      'ATTENDANCE_LATE', 'PAYROLL_RELEASED', 'ANNOUNCEMENT', 'SUBSCRIPTION_EXPIRING',
    ],
    required: true,
  })
  type: NotificationType;

  @Prop({ type: Object })
  data?: Record<string, unknown>;

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  readAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 });
