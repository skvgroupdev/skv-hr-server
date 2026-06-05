import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PayslipDocument = HydratedDocument<Payslip>;

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

  @Prop({
    type: String,
    enum: ['DRAFT', 'APPROVED', 'PAID'],
    default: 'DRAFT',
  })
  status: 'DRAFT' | 'APPROVED' | 'PAID';
}

export const PayslipSchema = SchemaFactory.createForClass(Payslip);
PayslipSchema.index({ tenantId: 1, payrollPeriodId: 1 });
PayslipSchema.index({ tenantId: 1, employeeId: 1 });
