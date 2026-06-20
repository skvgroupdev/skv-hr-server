import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UsersModule } from '../users/users.module';
import { AuditLogModule } from '../audit-logs/audit-log.module';
import { EmployeesModule } from '../employees/employees.module';
import { ShiftsModule } from '../shifts/shifts.module';
import { CompaniesModule } from '../companies/companies.module';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}), // secrets set per-sign via ConfigService
    UsersModule,
    AuditLogModule,
    EmployeesModule,
    ShiftsModule,
    CompaniesModule,
    PlansModule,
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
