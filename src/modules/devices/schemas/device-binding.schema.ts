import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DeviceBindingDocument = HydratedDocument<DeviceBinding>;

@Schema({ versionKey: false, toJSON: { virtuals: true, transform: (_doc, ret: Record<string, unknown>) => { delete ret._id; } } })
export class DeviceBinding {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  deviceId: string;

  @Prop()
  deviceName?: string;

  @Prop({ default: Date.now })
  boundAt: Date;
}

export const DeviceBindingSchema = SchemaFactory.createForClass(DeviceBinding);
DeviceBindingSchema.index({ tenantId: 1, userId: 1 });
