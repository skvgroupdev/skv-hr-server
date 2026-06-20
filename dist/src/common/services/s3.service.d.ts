import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private readonly configService;
    private readonly client;
    private readonly bucket;
    private readonly region;
    private readonly endpoint;
    constructor(configService: ConfigService);
    uploadFile(type: string | undefined, file: Express.Multer.File): Promise<{
        url: string;
        key: string;
    }>;
    deleteFile(key: string): Promise<void>;
    updateFile(oldKey: string, type: string | undefined, file: Express.Multer.File): Promise<{
        url: string;
        key: string;
    }>;
    private buildFileUrl;
}
