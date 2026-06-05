import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { InternalServerErrorException } from '@nestjs/common'
import { S3Service } from '../../../common/services/s3.service'

// Mock the AWS SDK modules
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  DeleteObjectCommand: jest.fn().mockImplementation((params) => params),
}))

jest.mock('@aws-sdk/lib-storage', () => ({
  Upload: jest.fn().mockImplementation(() => ({
    done: jest.fn().mockResolvedValue({}),
  })),
}))

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid-1234'),
}))

const mockConfigService = {
  getOrThrow: jest.fn().mockImplementation((key: string) => {
    const config: Record<string, string> = {
      S3_BUCKET: 'test-bucket',
      S3_REGION: 'ap-southeast-1',
      S3_ACCESS_KEY: 'test-access-key',
      S3_SECRET_KEY: 'test-secret-key',
    }
    return config[key]
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get: jest.fn().mockImplementation((_key: string) => undefined),
}

const makeMockFile = (name = 'photo.jpg', mime = 'image/jpeg'): Express.Multer.File => ({
  originalname: name,
  mimetype: mime,
  buffer: Buffer.from('fake-image-data'),
  size: 100,
  fieldname: 'file',
  encoding: '7bit',
  destination: '',
  filename: '',
  path: '',
  stream: null as any,
})

describe('S3Service', () => {
  let service: S3Service

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile()

    service = module.get<S3Service>(S3Service)
  })

  afterEach(() => jest.clearAllMocks())

  describe('uploadFile', () => {
    it('generates a uuid-based key with original extension', async () => {
      const { Upload } = require('@aws-sdk/lib-storage')
      const file = makeMockFile('photo.jpg')

      const url = await service.uploadFile('avatars', file)

      const uploadCallParams = Upload.mock.calls[0][0].params
      expect(uploadCallParams.Key).toBe('avatars/test-uuid-1234.jpg')
      expect(url).toBe('https://test-bucket.s3.ap-southeast-1.amazonaws.com/avatars/test-uuid-1234.jpg')
    })

    it('uses custom endpoint URL when S3_ENDPOINT is configured', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'S3_ENDPOINT') return 'http://minio:9000'
        return undefined
      })

      // Re-create service with endpoint configured
      const module = await Test.createTestingModule({
        providers: [
          S3Service,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile()

      const serviceWithEndpoint = module.get<S3Service>(S3Service)
      const url = await serviceWithEndpoint.uploadFile('avatars', makeMockFile())
      expect(url).toBe('http://minio:9000/test-bucket/avatars/test-uuid-1234.jpg')
    })

    it('throws InternalServerErrorException when upload fails', async () => {
      const { Upload } = require('@aws-sdk/lib-storage')
      Upload.mockImplementationOnce(() => ({
        done: jest.fn().mockRejectedValue(new Error('Network error')),
      }))

      await expect(service.uploadFile('avatars', makeMockFile())).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('deleteFile', () => {
    it('sends DeleteObjectCommand with correct bucket and key', async () => {
      const { S3Client } = require('@aws-sdk/client-s3')
      const mockSend = jest.fn().mockResolvedValue({})
      S3Client.mockImplementationOnce(() => ({ send: mockSend }))

      // Re-create service so it uses new mock
      const module = await Test.createTestingModule({
        providers: [
          S3Service,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile()
      const freshService = module.get<S3Service>(S3Service)

      await freshService.deleteFile('avatars/test-uuid-1234.jpg')

      expect(mockSend).toHaveBeenCalledTimes(1)
      const cmdArg = mockSend.mock.calls[0][0]
      expect(cmdArg).toMatchObject({ Bucket: 'test-bucket', Key: 'avatars/test-uuid-1234.jpg' })
    })

    it('throws InternalServerErrorException when delete fails', async () => {
      const { S3Client } = require('@aws-sdk/client-s3')
      S3Client.mockImplementationOnce(() => ({
        send: jest.fn().mockRejectedValue(new Error('Access denied')),
      }))

      const module = await Test.createTestingModule({
        providers: [
          S3Service,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile()
      const freshService = module.get<S3Service>(S3Service)

      await expect(freshService.deleteFile('avatars/old.jpg')).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('updateFile', () => {
    it('calls deleteFile then uploadFile and returns new URL', async () => {
      const deleteSpy = jest.spyOn(service, 'deleteFile').mockResolvedValue()
      const uploadSpy = jest
        .spyOn(service, 'uploadFile')
        .mockResolvedValue('https://test-bucket.s3.ap-southeast-1.amazonaws.com/avatars/new-uuid.jpg')

      const url = await service.updateFile('avatars/old.jpg', 'avatars', makeMockFile())

      expect(deleteSpy).toHaveBeenCalledWith('avatars/old.jpg')
      expect(uploadSpy).toHaveBeenCalledWith('avatars', expect.any(Object))
      expect(url).toContain('new-uuid')
    })
  })
})
