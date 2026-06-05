import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShiftAssignmentDocument = HydratedDocument<ShiftAssignment>;

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
export class ShiftAssignment {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Shift', required: true })
  shiftId: Types.ObjectId;

  @Prop({ required: true })
  effectiveDate: Date;

  @Prop()
  endDate?: Date;
}

export const ShiftAssignmentSchema = SchemaFactory.createForClass(ShiftAssignment);
ShiftAssignmentSchema.index({ tenantId: 1, employeeId: 1 });
ShiftAssignmentSchema.index({ employeeId: 1, effectiveDate: -1 });
