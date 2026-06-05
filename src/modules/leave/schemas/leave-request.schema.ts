import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LeaveRequestDocument = HydratedDocument<LeaveRequest>;

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
export class LeaveRequest {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'LeaveType', required: false })
  leaveTypeId?: Types.ObjectId;

  // Used when frontend hardcodes leave type name instead of referencing DB
  @Prop({ type: String })
  leaveTypeName?: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 1 })
  totalDays: number;

  @Prop({ default: false })
  isHalfDay: boolean;

  @Prop({ type: String, enum: ['AM', 'PM'] })
  halfDayPeriod?: 'AM' | 'PM';

  @Prop({ required: true })
  reason: string;

  @Prop({ type: [String], default: [] })
  attachmentUrls: string[];

  @Prop({
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

  @Prop({ default: 1 })
  currentApprovalStep: number;

  @Prop({
    type: [
      {
        approverId: { type: Types.ObjectId, ref: 'User' },
        role: String,
        status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'] },
        comment: String,
        approvedAt: Date,
      },
    ],
    default: [],
  })
  approvals: Array<{
    approverId: Types.ObjectId;
    role: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    comment?: string;
    approvedAt?: Date;
  }>;
}

export const LeaveRequestSchema = SchemaFactory.createForClass(LeaveRequest);
LeaveRequestSchema.index({ tenantId: 1, employeeId: 1 });
LeaveRequestSchema.index({ tenantId: 1, status: 1 });
