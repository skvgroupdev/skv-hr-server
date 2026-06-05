import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path'

@Injectable()
export class S3Service {
  private readonly client: S3Client
  private readonly bucket: string
  private readonly region: string
  private readonly endpoint: string | undefined

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET')
    this.region = this.configService.getOrThrow<string>('S3_REGION')
    this.endpoint = this.configService.get<string>('S3_ENDPOINT')

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_KEY'),
      },
      ...(this.endpoint && { endpoint: this.endpoint, forcePathStyle: true }),
    })
  }

  async uploadFile(type: string = '', file: Express.Multer.File): Promise<{ url: string; key: string }> {
    const ext = path.extname(file.originalname)
    const subPath = type ? `skv-hr/${type}` : 'skv-hr'
    const key = `${subPath}/${uuidv4()}${ext}`

    try {
      const upload = new Upload({
        client: this.client,
        params: { Bucket: this.bucket, Key: key, Body: file.buffer, ContentType: file.mimetype },
      })
      await upload.done()
      return { url: this.buildFileUrl(key), key }
    } catch (error) {
      throw new InternalServerErrorException(`Upload failed: ${(error as Error).message}`)
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
    } catch (error) {
      throw new InternalServerErrorException(`Delete failed: ${(error as Error).message}`)
    }
  }

  async updateFile(oldKey: string, type: string = '', file: Express.Multer.File): Promise<{ url: string; key: string }> {
    await this.deleteFile(oldKey)
    return this.uploadFile(type, file)
  }

  private buildFileUrl(key: string): string {
    if (this.endpoint) {
      // MinIO / self-hosted: {endpoint}/{bucket}/{key}
      return `${this.endpoint}/${this.bucket}/${key}`
    }
    // Standard AWS S3
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
  }
}
