import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HolidayDocument = HydratedDocument<Holiday>;

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
export class Holiday {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: String, enum: ['PUBLIC', 'COMPANY'], required: true })
  type: 'PUBLIC' | 'COMPANY';

  @Prop({ default: true })
  isActive: boolean;
}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);
HolidaySchema.index({ tenantId: 1, date: 1 });
