import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PositionDocument = HydratedDocument<Position>;

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
export class Position {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  level?: number;

  @Prop()
  description?: string;

  @Prop()
  banding?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const PositionSchema = SchemaFactory.createForClass(Position);

PositionSchema.index({ tenantId: 1 });
