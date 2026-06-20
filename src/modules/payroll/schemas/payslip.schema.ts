import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PayslipDocument = HydratedDocument<Payslip>;

export interface PayrollAdjustment {
  kind: 'ADDITION' | 'DEDUCTION';
  name: string;
  amount: number;
  reason: string;
  source: 'SYSTEM' | 'MANUAL' | 'PREVIOUS_PERIOD_CORRECTION';
  createdBy?: Types.ObjectId;
  createdAt: Date;
}

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
export class Payslip {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PayrollPeriod', required: true })
  payrollPeriodId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ default: 0 })
  baseSalary: number;

  @Prop({ type: [{ name: String, amount: Number }], default: [] })
  allowances: { name: string; amount: number }[];

  @Prop({ default: 0 })
  otHours: number;

  @Prop({ default: 0 })
  otAmount: number;

  @Prop({ default: 0 })
  grossSalary: number;

  @Prop({ default: 0 })
  employeeSsAmount: number;

  @Prop({ default: 0 })
  taxableIncome: number;

  @Prop({ default: 0 })
  incomeTax: number;

  @Prop({ type: [{ name: String, amount: Number }], default: [] })
  otherDeductions: { name: string; amount: number }[];

  @Prop({ default: 0 })
  totalDeductions: number;

  @Prop({ default: 0 })
  netSalary: number;

  @Prop({ default: 0 })
  employerSsAmount: number;

  @Prop({ type: Object })
  taxConfigSnapshot?: Record<string, unknown>;

  @Prop({ type: String })
  taxMode?: string;

  @Prop({ default: 0 })
  leaveDeductionDays: number;

  @Prop({ default: 0 })
  leaveDeductionAmount: number;

  @Prop({ default: 0 })
  approvedRestDays: number;

  @Prop({ default: 0 })
  unusedRestDays: number;

  @Prop({ default: 0 })
  restDayCompensationAmount: number;

  @Prop({ type: Object })
  payrollPolicySnapshot?: Record<string, unknown>;

  @Prop({
    type: [
      {
        kind: { type: String, enum: ['ADDITION', 'DEDUCTION'] },
        name: String,
        amount: Number,
        reason: String,
        source: {
          type: String,
          enum: ['SYSTEM', 'MANUAL', 'PREVIOUS_PERIOD_CORRECTION'],
        },
        createdBy: { type: Types.ObjectId, ref: 'User' },
        createdAt: Date,
      },
    ],
    default: [],
  })
  adjustments: PayrollAdjustment[];

  @Prop({
    type: String,
    enum: ['DRAFT', 'HR_REVIEWED', 'PAID', 'APPROVED'],
    default: 'DRAFT',
  })
  status: 'DRAFT' | 'HR_REVIEWED' | 'PAID' | 'APPROVED';
}

export const PayslipSchema = SchemaFactory.createForClass(Payslip);
PayslipSchema.index({ tenantId: 1, payrollPeriodId: 1 });
PayslipSchema.index({ tenantId: 1, employeeId: 1 });
