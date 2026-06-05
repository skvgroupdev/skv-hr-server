import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DocumentRecordDocument = HydratedDocument<DocumentRecord>;

export type DocumentType =
  | 'ID_CARD'
  | 'PASSPORT'
  | 'CONTRACT'
  | 'CV'
  | 'CERTIFICATE'
  | 'MEDICAL'
  | 'OTHER';

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
export class DocumentRecord {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop()
  fileName?: string;

  @Prop()
  fileUrl?: string;

  @Prop()
  fileType?: string;

  @Prop({
    type: String,
    enum: ['ID_CARD', 'PASSPORT', 'CONTRACT', 'CV', 'CERTIFICATE', 'MEDICAL', 'OTHER'],
    default: 'OTHER',
  })
  documentType: DocumentType;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  uploadedBy?: Types.ObjectId;
}

export const DocumentRecordSchema = SchemaFactory.createForClass(DocumentRecord);

DocumentRecordSchema.index({ tenantId: 1, employeeId: 1 });
