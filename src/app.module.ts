import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './database/seed.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { AuditLogModule } from './modules/audit-logs/audit-log.module';
import { BranchesModule } from './modules/branches/branches.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { DocumentsModule } from './modules/documents/documents.module';
// Phase 3
import { ShiftsModule } from './modules/shifts/shifts.module';
import { HolidaysModule } from './modules/holidays/holidays.module';
import { DevicesModule } from './modules/devices/devices.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
// Phase 4
import { OutsideWorkModule } from './modules/outside-work/outside-work.module';
import { LeaveModule } from './modules/leave/leave.module';
import { OTModule } from './modules/ot/ot.module';
// Phase 5
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { ReportsModule } from './modules/reports/reports.module';
// Uploads
import { UploadsModule } from './modules/uploads/uploads.module';
// Phase 6
import { TaxConfigsModule } from './modules/tax-configs/tax-configs.module';
import { PlansModule } from './modules/plans/plans.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from './common/guards/subscription.guard';
import { CompanyPoliciesModule } from './modules/company-policies/company-policies.module';
import { AttendanceAdjustmentsModule } from './modules/attendance-adjustments/attendance-adjustments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 10,
      },
    ]),
    DatabaseModule,
    SeedModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    AuditLogModule,
    BranchesModule,
    DepartmentsModule,
    PositionsModule,
    EmployeesModule,
    DocumentsModule,
    // Phase 3
    ShiftsModule,
    HolidaysModule,
    DevicesModule,
    AttendanceModule,
    // Phase 4
    OutsideWorkModule,
    LeaveModule,
    OTModule,
    // Phase 5
    NotificationsModule,
    AnnouncementsModule,
    ReportsModule,
    // Phase 6
    TaxConfigsModule,
    PlansModule,
    PayrollModule,
    CompanyPoliciesModule,
    AttendanceAdjustmentsModule,
    DashboardModule,
    UploadsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new JwtAuthGuard(reflector),
      inject: [Reflector],
    },
    {
      provide: APP_GUARD,
      useClass: SubscriptionGuard,
    },
  ],
})
export class AppModule {}
