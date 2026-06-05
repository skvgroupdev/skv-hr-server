import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DocumentRecord, DocumentRecordDocument, DocumentType } from './schemas/document.schema';

export interface CreateDocumentData {
  tenantId: Types.ObjectId;
  employeeId: Types.ObjectId;
  fileName?: string;
  fileUrl: string;
  fileType?: string;
  documentType?: DocumentType;
  description?: string;
  uploadedBy: Types.ObjectId;
}

@Injectable()
export class DocumentsRepository {
  constructor(
    @InjectModel(DocumentRecord.name)
    private readonly documentModel: Model<DocumentRecordDocument>,
  ) {}

  async create(data: CreateDocumentData): Promise<DocumentRecordDocument> {
    return this.documentModel.create(data);
  }

  async findByEmployee(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
  ): Promise<DocumentRecordDocument[]> {
    return this.documentModel.find({ employeeId, tenantId }).sort({ createdAt: -1 }).exec();
  }
}
