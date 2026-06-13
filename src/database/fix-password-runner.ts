import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, InjectModel } from '@nestjs/mongoose';
import { Module, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserSchema, UserDocument } from '../modules/users/schemas/user.schema';
import configuration from '../config/configuration';

const TARGET_PHONE = '+8562055552222';
const NEW_PASSWORD = '12345678';
const BCRYPT_ROUNDS = 12;

@Injectable()
class FixPasswordService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async run(): Promise<void> {
    // Find all users with this phone (could be in multiple companies)
    const users = await this.userModel.find({ phone: TARGET_PHONE }).lean();

    if (users.length === 0) {
      console.error(`No user found with phone ${TARGET_PHONE}`);
      return;
    }

    console.log(`Found ${users.length} user(s) with phone ${TARGET_PHONE}`);

    const hashed = await bcrypt.hash(NEW_PASSWORD, BCRYPT_ROUNDS);

    for (const user of users) {
      await this.userModel.updateOne(
        { _id: user._id },
        { $set: { password: hashed } },
      );
      console.log(`Updated password for user _id=${user._id} role=${user.role} companyId=${user.companyId ?? 'null'}`);
    }

    console.log('Done. Password has been re-hashed with bcrypt rounds=12.');
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skv_hr'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [FixPasswordService],
})
class FixPasswordAppModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(FixPasswordAppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const service = app.get(FixPasswordService);
  await service.run();
  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
