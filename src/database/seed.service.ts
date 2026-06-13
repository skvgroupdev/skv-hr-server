import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../modules/users/schemas/user.schema';

const BCRYPT_ROUNDS = 12;

const SUPER_ADMIN_PHONE = '+85620000001';
const SUPER_ADMIN_PASSWORD = 'Admin@1234';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin() {
    const existing = await this.userModel.findOne({
      phone: SUPER_ADMIN_PHONE,
      role: 'SUPER_ADMIN',
    });

    if (existing) {
      this.logger.log('Super Admin already exists — skipping');
      return;
    }

    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, BCRYPT_ROUNDS);

    await this.userModel.create({
      phone: SUPER_ADMIN_PHONE,
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      companyId: null,
      branchId: null,
      isActive: true,
    });

    this.logger.log(`Super Admin seeded — phone: ${SUPER_ADMIN_PHONE} | password: ${SUPER_ADMIN_PASSWORD}`);
  }
}
