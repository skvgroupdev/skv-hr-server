import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OutsideWork, OutsideWorkSchema } from './schemas/outside-work.schema';
import { OutsideWorkRepository } from './outside-work.repository';
import { OutsideWorkService } from './outside-work.service';
import { OutsideWorkController } from './outside-work.controller';
import { AttendanceModule } from '../attendance/attendance.module';
import { EmployeesModule } from '../employees/employees.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OutsideWork.name, schema: OutsideWorkSchema }]),
    AttendanceModule,
    EmployeesModule,
    NotificationsModule,
  ],
  providers: [OutsideWorkRepository, OutsideWorkService],
  controllers: [OutsideWorkController],
  exports: [OutsideWorkRepository],
})
export class OutsideWorkModule {}
