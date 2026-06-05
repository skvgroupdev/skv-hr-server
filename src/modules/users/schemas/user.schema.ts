import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export type UserRole =
  | 'SUPER_ADMIN'
  | 'COMPANY_OWNER'
  | 'HR_ADMIN'
  | 'BRANCH_MANAGER'
  | 'SUPERVISOR'
  | 'STAFF';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      delete ret._id;
      delete ret.password;
      delete ret.refreshToken;
    },
  },
})
export class User {
  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    type: String,
    enum: ['SUPER_ADMIN', 'COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR', 'STAFF'],
    required: true,
  })
  role: UserRole;

  @Prop({ type: Types.ObjectId, ref: 'Company', default: null })
  companyId: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, default: null })
  branchId: Types.ObjectId | null;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, select: false, default: null })
  refreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

// phone must be unique per company (SUPER_ADMIN has null companyId)
UserSchema.index({ phone: 1, companyId: 1 }, { unique: true });
