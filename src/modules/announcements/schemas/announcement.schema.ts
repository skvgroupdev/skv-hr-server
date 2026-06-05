import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AnnouncementDocument = HydratedDocument<Announcement>;

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
export class Announcement {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, enum: ['ALL', 'BRANCH', 'DEPARTMENT', 'ROLE'], default: 'ALL' })
  targetType: 'ALL' | 'BRANCH' | 'DEPARTMENT' | 'ROLE';

  @Prop({ type: [Types.ObjectId], default: [] })
  targetIds: Types.ObjectId[];

  @Prop({ default: false })
  isPinned: boolean;

  @Prop()
  publishedAt?: Date;

  @Prop({ type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' })
  status: 'DRAFT' | 'PUBLISHED';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  readBy: Types.ObjectId[];
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
AnnouncementSchema.index({ tenantId: 1, status: 1 });
AnnouncementSchema.index({ tenantId: 1, isPinned: 1 });
