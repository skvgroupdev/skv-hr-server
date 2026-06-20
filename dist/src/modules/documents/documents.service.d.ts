import { Types } from 'mongoose';
import { DocumentsRepository, CreateDocumentData } from './documents.repository';
export declare class DocumentsService {
    private readonly documentsRepository;
    constructor(documentsRepository: DocumentsRepository);
    addDocument(data: CreateDocumentData): Promise<import("mongoose").Document<unknown, {}, import("./schemas/document.schema").DocumentRecord, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/document.schema").DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getEmployeeDocuments(employeeId: Types.ObjectId, tenantId: Types.ObjectId): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/document.schema").DocumentRecord, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/document.schema").DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
