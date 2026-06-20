import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CompanyPolicyDocument = HydratedDocument<CompanyPolicy>;
export type WorkScheduleMode = 'UNIFORM' | 'SHIFT_BASED';
export type SalaryCalculationMode = 'MONTHLY_FIXED' | 'ATTENDANCE_BASED';
export type DailyRateMethod = 'CALENDAR_30' | 'SCHEDULED_WORKDAYS';

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
export class CompanyPolicy {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  effectiveFrom: Date;

  @Prop({ type: String, enum: ['UNIFORM', 'SHIFT_BASED'], default: 'UNIFORM' })
  workScheduleMode: WorkScheduleMode;

  @Prop({
    type: {
      startTime: String,
      endTime: String,
      breakStartTime: String,
      breakEndTime: String,
      workDays: [Number],
      gracePeriodMinutes: Number,
      isOvernight: Boolean,
    },
    default: {
      startTime: '09:00',
      endTime: '18:00',
      workDays: [1, 2, 3, 4, 5],
      gracePeriodMinutes: 15,
      isOvernight: false,
    },
  })
  uniformSchedule: {
    startTime: string;
    endTime: string;
    breakStartTime?: string;
    breakEndTime?: string;
    workDays: number[];
    gracePeriodMinutes: number;
    isOvernight: boolean;
  };

  @Prop({
    type: String,
    enum: ['MONTHLY_FIXED', 'ATTENDANCE_BASED'],
    default: 'MONTHLY_FIXED',
  })
  salaryCalculationMode: SalaryCalculationMode;

  @Prop({
    type: String,
    enum: ['CALENDAR_30', 'SCHEDULED_WORKDAYS'],
    default: 'CALENDAR_30',
  })
  dailyRateMethod: DailyRateMethod;

  @Prop({ default: false })
  restDayPolicyEnabled: boolean;

  @Prop({ default: 4, min: 0 })
  monthlyRestDays: number;

  @Prop({ default: false })
  unusedRestDayCompensationEnabled: boolean;

  @Prop({ default: false })
  unusedRestDaysCarryForward: boolean;

  @Prop({ default: 15, min: 0 })
  lateToleranceMinutes: number;

  @Prop({ default: 0, min: 0 })
  earlyLeaveToleranceMinutes: number;

  @Prop({ default: false })
  absenceDeductionEnabled: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const CompanyPolicySchema = SchemaFactory.createForClass(CompanyPolicy);
CompanyPolicySchema.index({ tenantId: 1, effectiveFrom: -1 });
