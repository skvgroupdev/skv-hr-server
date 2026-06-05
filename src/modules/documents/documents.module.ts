import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentRecord, DocumentRecordSchema } from './schemas/document.schema';
import { DocumentsRepository } from './documents.repository';
import { DocumentsService } from './documents.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DocumentRecord.name, schema: DocumentRecordSchema }]),
  ],
  providers: [DocumentsRepository, DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
