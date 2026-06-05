import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceLog, AttendanceLogSchema } from './schemas/attendance-log.schema';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { GeofenceService } from './geofence.service';
import { AuditLogModule } from '../audit-logs/audit-log.module';
import { EmployeesModule } from '../employees/employees.module';
import { BranchesModule } from '../branches/branches.module';
import { ShiftsModule } from '../shifts/shifts.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AttendanceLog.name, schema: AttendanceLogSchema }]),
    AuditLogModule,
    EmployeesModule,
    BranchesModule,
    ShiftsModule,
    NotificationsModule,
  ],
  providers: [AttendanceRepository, AttendanceService, GeofenceService],
  controllers: [AttendanceController],
  exports: [AttendanceRepository, AttendanceService],
})
export class AttendanceModule {}
