import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { FullSeedService } from './full-seed.service';

import { Company, CompanySchema } from '../modules/companies/schemas/company.schema';
import { Branch, BranchSchema } from '../modules/branches/schemas/branch.schema';
import { Department, DepartmentSchema } from '../modules/departments/schemas/department.schema';
import { Position, PositionSchema } from '../modules/positions/schemas/position.schema';
import { User, UserSchema } from '../modules/users/schemas/user.schema';
import { Employee, EmployeeSchema } from '../modules/employees/schemas/employee.schema';
import { Shift, ShiftSchema } from '../modules/shifts/schemas/shift.schema';
import { ShiftAssignment, ShiftAssignmentSchema } from '../modules/shifts/schemas/shift-assignment.schema';
import { Holiday, HolidaySchema } from '../modules/holidays/schemas/holiday.schema';
import { AttendanceLog, AttendanceLogSchema } from '../modules/attendance/schemas/attendance-log.schema';
import { LeaveType, LeaveTypeSchema } from '../modules/leave/schemas/leave-type.schema';
import { LeaveBalance, LeaveBalanceSchema } from '../modules/leave/schemas/leave-balance.schema';
import { LeaveRequest, LeaveRequestSchema } from '../modules/leave/schemas/leave-request.schema';
import { OTRequest, OTRequestSchema } from '../modules/ot/schemas/ot-request.schema';

import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skv_hr'),
    MongooseModule.forFeature([
      { name: Company.name,         schema: CompanySchema },
      { name: Branch.name,          schema: BranchSchema },
      { name: Department.name,      schema: DepartmentSchema },
      { name: Position.name,        schema: PositionSchema },
      { name: User.name,            schema: UserSchema },
      { name: Employee.name,        schema: EmployeeSchema },
      { name: Shift.name,           schema: ShiftSchema },
      { name: ShiftAssignment.name, schema: ShiftAssignmentSchema },
      { name: Holiday.name,         schema: HolidaySchema },
      { name: AttendanceLog.name,   schema: AttendanceLogSchema },
      { name: LeaveType.name,       schema: LeaveTypeSchema },
      { name: LeaveBalance.name,    schema: LeaveBalanceSchema },
      { name: LeaveRequest.name,    schema: LeaveRequestSchema },
      { name: OTRequest.name,       schema: OTRequestSchema },
    ]),
  ],
  providers: [FullSeedService],
})
class FullSeedAppModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(FullSeedAppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const seedService = app.get(FullSeedService);

  try {
    await seedService.run();
    console.log('Full seed completed successfully.');
  } catch (err) {
    console.error('Full seed failed:', err);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
