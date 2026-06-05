import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';

export class UploadDocumentDto {
  @IsOptional()
  @IsString()
  fileName?: string;

  @IsUrl()
  fileUrl: string;

  @IsOptional()
  @IsString()
  fileType?: string;

  @IsOptional()
  @IsEnum(['ID_CARD', 'PASSPORT', 'CONTRACT', 'CV', 'CERTIFICATE', 'MEDICAL', 'OTHER'])
  documentType?: 'ID_CARD' | 'PASSPORT' | 'CONTRACT' | 'CV' | 'CERTIFICATE' | 'MEDICAL' | 'OTHER';

  @IsOptional()
  @IsString()
  description?: string;
}
