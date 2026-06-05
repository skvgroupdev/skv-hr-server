import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByIdWithSensitive(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('+password +refreshToken').exec();
  }

  async findByPhoneAndCompany(
    phone: string,
    companyId: Types.ObjectId | null,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ phone, companyId })
      .select('+password +refreshToken')
      .exec();
  }

  async findAllByPhone(phone: string): Promise<UserDocument[]> {
    return this.userModel.find({ phone }).exec();
  }

  async create(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async updateRefreshToken(userId: string, hashedToken: string | null): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashedToken }).exec();
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword }).exec();
  }

  async updatePhone(userId: string, phone: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { phone }).exec();
  }

  async updateRole(userId: string, role: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { role }).exec();
  }

  async findByCompanyId(companyId: Types.ObjectId): Promise<UserDocument[]> {
    return this.userModel.find({ companyId }).exec();
  }

  async existsByPhoneAndCompany(
    phone: string,
    companyId: Types.ObjectId | null,
  ): Promise<boolean> {
    const count = await this.userModel.countDocuments({ phone, companyId }).exec();
    return count > 0;
  }
}
