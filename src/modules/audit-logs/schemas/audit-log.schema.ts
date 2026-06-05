import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class AuditLog {
  @Prop({ type: Types.ObjectId, default: null, index: true })
  tenantId: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  actorId: Types.ObjectId;

  @Prop({ required: true })
  actorRole: string;

  @Prop({ required: true, index: true })
  action: string;

  @Prop()
  module?: string;

  @Prop({ type: Types.ObjectId, default: null })
  targetId: Types.ObjectId | null;

  @Prop({ type: Object, default: null })
  before: Record<string, unknown> | null;

  @Prop({ type: Object, default: null })
  after: Record<string, unknown> | null;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
