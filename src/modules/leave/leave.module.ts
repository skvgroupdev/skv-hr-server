import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveType, LeaveTypeSchema } from './schemas/leave-type.schema';
import { LeaveBalance, LeaveBalanceSchema } from './schemas/leave-balance.schema';
import { LeaveRequest, LeaveRequestSchema } from './schemas/leave-request.schema';
import { LeaveRepository } from './leave.repository';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { EmployeesModule } from '../employees/employees.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeaveType.name, schema: LeaveTypeSchema },
      { name: LeaveBalance.name, schema: LeaveBalanceSchema },
      { name: LeaveRequest.name, schema: LeaveRequestSchema },
    ]),
    EmployeesModule,
    NotificationsModule,
    UsersModule,
  ],
  providers: [LeaveRepository, LeaveService],
  controllers: [LeaveController],
  exports: [LeaveRepository, LeaveService],
})
export class LeaveModule {}
