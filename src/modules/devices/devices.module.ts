import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceToken, DeviceTokenSchema } from './schemas/device-token.schema';
import { DeviceBinding, DeviceBindingSchema } from './schemas/device-binding.schema';
import { DevicesRepository } from './devices.repository';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeviceToken.name, schema: DeviceTokenSchema },
      { name: DeviceBinding.name, schema: DeviceBindingSchema },
    ]),
  ],
  providers: [DevicesRepository, DevicesService],
  controllers: [DevicesController],
  exports: [DevicesRepository, DevicesService],
})
export class DevicesModule {}
