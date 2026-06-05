import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AttendanceModule } from '../attendance/attendance.module';
import { LeaveModule } from '../leave/leave.module';
import { OTModule } from '../ot/ot.module';

@Module({
  imports: [AttendanceModule, LeaveModule, OTModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
