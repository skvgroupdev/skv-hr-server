import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OTPolicy, OTPolicySchema } from './schemas/ot-policy.schema';
import { OTRequest, OTRequestSchema } from './schemas/ot-request.schema';
import { OTRepository } from './ot.repository';
import { OTService } from './ot.service';
import { OTController } from './ot.controller';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OTPolicy.name, schema: OTPolicySchema },
      { name: OTRequest.name, schema: OTRequestSchema },
    ]),
    EmployeesModule,
  ],
  providers: [OTRepository, OTService],
  controllers: [OTController],
  exports: [OTRepository, OTService],
})
export class OTModule {}
