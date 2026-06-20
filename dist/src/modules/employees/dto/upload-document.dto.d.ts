export declare class UploadDocumentDto {
    fileName?: string;
    fileUrl: string;
    fileType?: string;
    documentType?: 'ID_CARD' | 'PASSPORT' | 'CONTRACT' | 'CV' | 'CERTIFICATE' | 'MEDICAL' | 'OTHER';
    description?: string;
}
