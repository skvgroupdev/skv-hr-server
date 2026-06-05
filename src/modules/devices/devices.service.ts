import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DevicesRepository } from './devices.repository';
import { RegisterTokenDto } from './dto/register-token.dto';
import { RemoveTokenDto } from './dto/remove-token.dto';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  async registerToken(tenantId: string, userId: string, dto: RegisterTokenDto) {
    return this.devicesRepository.upsertToken(
      new Types.ObjectId(tenantId),
      new Types.ObjectId(userId),
      dto.token,
      dto.platform,
    );
  }

  async removeToken(dto: RemoveTokenDto) {
    await this.devicesRepository.removeToken(dto.token);
    return { message: 'Token removed' };
  }

  async getTokensByUser(userId: string) {
    return this.devicesRepository.findTokensByUser(new Types.ObjectId(userId));
  }
}
