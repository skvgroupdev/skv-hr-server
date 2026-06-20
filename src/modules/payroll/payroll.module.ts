import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PayrollPeriod,
  PayrollPeriodSchema,
} from './schemas/payroll-period.schema';
import { Payslip, PayslipSchema } from './schemas/payslip.schema';
import { PayrollRepository } from './payroll.repository';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { CompanyPoliciesModule } from '../company-policies/company-policies.module';
import { ShiftsModule } from '../shifts/shifts.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { TaxConfigsModule } from '../tax-configs/tax-configs.module';
import { EmployeesModule } from '../employees/employees.module';
import { OTModule } from '../ot/ot.module';
import { LeaveModule } from '../leave/leave.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PayrollPeriod.name, schema: PayrollPeriodSchema },
      { name: Payslip.name, schema: PayslipSchema },
    ]),
    TaxConfigsModule,
    CompanyPoliciesModule,
    ShiftsModule,
    AttendanceModule,
    EmployeesModule,
    OTModule,
    LeaveModule,
  ],
  providers: [PayrollRepository, PayrollService],
  controllers: [PayrollController],
  exports: [PayrollRepository],
})
export class PayrollModule {}
