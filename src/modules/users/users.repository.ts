import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByIdWithSensitive(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('+password +refreshToken').exec();
  }

  private phoneVariants(phone: string): string[] {
    const local = phone.replace(/^\+?856/, '').replace(/^0/, '');
    return [local, `0${local}`, `856${local}`, `+856${local}`];
  }

  async findByPhoneAndCompany(
    phone: string,
    companyId: Types.ObjectId | null,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ phone: { $in: this.phoneVariants(phone) }, companyId })
      .select('+password +refreshToken')
      .exec();
  }

  async findAllByPhone(phone: string): Promise<UserDocument[]> {
    return this.userModel
      .find({ phone: { $in: this.phoneVariants(phone) } })
      .exec();
  }

  async create(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async deleteById(userId: string): Promise<void> {
    await this.userModel.deleteOne({ _id: userId }).exec();
  }

  async updateRefreshToken(
    userId: string,
    hashedToken: string | null,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, { refreshToken: hashedToken })
      .exec();
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, { password: hashedPassword })
      .exec();
  }

  async updatePhone(userId: string, phone: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { phone }).exec();
  }

  async updateRole(userId: string, role: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { role }).exec();
  }

  async updateRoleAndBranch(
    userId: string,
    companyId: Types.ObjectId,
    role: string,
    branchId: Types.ObjectId,
  ): Promise<void> {
    await this.userModel
      .findOneAndUpdate({ _id: userId, companyId }, { role, branchId })
      .exec();
  }

  async findByCompanyId(companyId: Types.ObjectId): Promise<UserDocument[]> {
    return this.userModel.find({ companyId }).exec();
  }

  async findByRolesAndTenant(
    companyId: Types.ObjectId,
    roles: UserRole[],
  ): Promise<UserDocument[]> {
    return this.userModel.find({ companyId, role: { $in: roles } }).exec();
  }

  async existsByPhoneAndCompany(
    phone: string,
    companyId: Types.ObjectId | null,
  ): Promise<boolean> {
    const count = await this.userModel
      .countDocuments({ phone, companyId })
      .exec();
    return count > 0;
  }
}
