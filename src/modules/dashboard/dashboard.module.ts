import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from '../employees/schemas/employee.schema';
import { Branch, BranchSchema } from '../branches/schemas/branch.schema';
import { AttendanceModule } from '../attendance/attendance.module';
import { LeaveModule } from '../leave/leave.module';
import { OTModule } from '../ot/ot.module';
import { OutsideWorkModule } from '../outside-work/outside-work.module';
import { DashboardRepository } from './dashboard.repository';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Branch.name, schema: BranchSchema },
    ]),
    AttendanceModule,
    LeaveModule,
    OTModule,
    OutsideWorkModule,
  ],
  providers: [DashboardRepository, DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
