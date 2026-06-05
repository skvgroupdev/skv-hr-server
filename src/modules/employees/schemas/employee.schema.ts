import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EmployeeDocument = HydratedDocument<Employee>;

export type EmployeeStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PROBATION'
  | 'RESIGNED'
  | 'SUSPENDED'
  | 'TERMINATED';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

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
export class Employee {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  // Identity
  @Prop({ trim: true })
  employeeCode?: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ type: String, enum: ['MALE', 'FEMALE', 'OTHER'] })
  gender?: Gender;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop()
  address?: string;

  @Prop()
  photoUrl?: string;

  @Prop()
  nationality?: string;

  @Prop({
    type: {
      name: String,
      phone: String,
      relation: String,
    },
    default: null,
  })
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  } | null;

  // Employment
  @Prop({ type: String, enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'] })
  employmentType?: EmploymentType;

  @Prop()
  startDate?: Date;

  @Prop()
  probationEndDate?: Date;

  @Prop()
  resignationDate?: Date;

  @Prop({
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'PROBATION', 'RESIGNED', 'SUSPENDED', 'TERMINATED'],
    default: 'ACTIVE',
  })
  status: EmployeeStatus;

  // Organization
  @Prop({ type: Types.ObjectId, ref: 'Branch', default: null })
  branchId: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Department', default: null })
  departmentId: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Position', default: null })
  positionId: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Employee', default: null })
  managerId: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Employee', default: null })
  supervisorId: Types.ObjectId | null;

  // Salary (Phase 2 basic)
  @Prop()
  baseSalary?: number;

  @Prop({ type: [{ name: String, amount: Number }], default: [] })
  allowances: { name: string; amount: number }[];

  @Prop({ default: 208 })
  workingHoursPerMonth: number;

  @Prop()
  bankName?: string;

  @Prop()
  bankAccount?: string;

  @Prop()
  paymentMethod?: string;

  // System
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.index({ tenantId: 1 });
EmployeeSchema.index({ tenantId: 1, phone: 1 }, { unique: true });
EmployeeSchema.index({ tenantId: 1, branchId: 1 });
EmployeeSchema.index({ tenantId: 1, departmentId: 1 });
