import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DocumentsRepository, CreateDocumentData } from './documents.repository';

@Injectable()
export class DocumentsService {
  constructor(private readonly documentsRepository: DocumentsRepository) {}

  async addDocument(data: CreateDocumentData) {
    return this.documentsRepository.create(data);
  }

  async getEmployeeDocuments(employeeId: Types.ObjectId, tenantId: Types.ObjectId) {
    return this.documentsRepository.findByEmployee(employeeId, tenantId);
  }
}
