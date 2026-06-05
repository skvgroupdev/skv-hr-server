import {
  Controller,
  Post,
  Delete,
  Patch,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { S3Service } from '../../common/services/s3.service'

@Controller('uploads')
export class UploadsController {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: string,
  ) {
    if (!file) throw new BadRequestException('No file provided')
    const result = await this.s3Service.uploadFile(type, file)
    return { data: result }
  }

  @Delete()
  async remove(@Query('key') key: string) {
    if (!key) throw new BadRequestException('Query param "key" is required')
    await this.s3Service.deleteFile(key)
    return { data: { deleted: true } }
  }

  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body('oldKey') oldKey: string,
    @Query('type') type: string,
  ) {
    if (!file) throw new BadRequestException('No file provided')
    if (!oldKey) throw new BadRequestException('"oldKey" is required')
    const result = await this.s3Service.updateFile(oldKey, type, file)
    return { data: result }
  }
}
