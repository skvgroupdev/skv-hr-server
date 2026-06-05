import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeviceToken, DeviceTokenDocument } from './schemas/device-token.schema';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectModel(DeviceToken.name) private readonly tokenModel: Model<DeviceTokenDocument>,
  ) {}

  async upsertToken(
    tenantId: Types.ObjectId,
    userId: Types.ObjectId,
    token: string,
    platform: 'ios' | 'android' | 'web',
  ): Promise<DeviceTokenDocument> {
    return this.tokenModel.findOneAndUpdate(
      { token },
      { tenantId, userId, token, platform },
      { upsert: true, returnDocument: 'after' },
    ).exec() as Promise<DeviceTokenDocument>;
  }

  async removeToken(token: string): Promise<void> {
    await this.tokenModel.deleteOne({ token }).exec();
  }

  async findTokensByUser(userId: Types.ObjectId): Promise<DeviceTokenDocument[]> {
    return this.tokenModel.find({ userId }).exec();
  }
}
