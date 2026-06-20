import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AttendanceAdjustment,
  AttendanceAdjustmentSchema,
} from './schemas/attendance-adjustment.schema';
import { AttendanceAdjustmentsRepository } from './attendance-adjustments.repository';
import { AttendanceAdjustmentsService } from './attendance-adjustments.service';
import { AttendanceAdjustmentsController } from './attendance-adjustments.controller';
import { AttendanceModule } from '../attendance/attendance.module';
import { EmployeesModule } from '../employees/employees.module';
import { AuditLogModule } from '../audit-logs/audit-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AttendanceAdjustment.name, schema: AttendanceAdjustmentSchema },
    ]),
    AttendanceModule,
    EmployeesModule,
    AuditLogModule,
  ],
  providers: [AttendanceAdjustmentsRepository, AttendanceAdjustmentsService],
  controllers: [AttendanceAdjustmentsController],
})
export class AttendanceAdjustmentsModule {}
