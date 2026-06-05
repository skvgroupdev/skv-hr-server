import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BranchDocument = HydratedDocument<Branch>;

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
export class Branch {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  code?: string;

  @Prop()
  address?: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: [Number],
  })
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({ default: 100 })
  radiusMeters: number;

  @Prop()
  phone?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  managerId: Types.ObjectId | null;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  workingPolicy?: string;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);

BranchSchema.index({ tenantId: 1 });
BranchSchema.index({ location: '2dsphere' }, { sparse: true });
