import { S3Service } from '../../common/services/s3.service';
export declare class UploadsController {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    upload(file: Express.Multer.File, type: string): Promise<{
        data: {
            url: string;
            key: string;
        };
    }>;
    remove(key: string): Promise<{
        data: {
            deleted: boolean;
        };
    }>;
    update(file: Express.Multer.File, oldKey: string, type: string): Promise<{
        data: {
            url: string;
            key: string;
        };
    }>;
}
