import { Model, Types } from 'mongoose';
import { DocumentRecordDocument, DocumentType } from './schemas/document.schema';
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
export declare class DocumentsRepository {
    private readonly documentModel;
    constructor(documentModel: Model<DocumentRecordDocument>);
    create(data: CreateDocumentData): Promise<DocumentRecordDocument>;
    findByEmployee(employeeId: Types.ObjectId, tenantId: Types.ObjectId): Promise<DocumentRecordDocument[]>;
}
