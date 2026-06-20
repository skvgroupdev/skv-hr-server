import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CompanyPoliciesService } from './company-policies.service';
import { UpdateAttendancePolicyDto } from './dto/update-attendance-policy.dto';
import { UpdatePayrollPolicyDto } from './dto/update-payroll-policy.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequireFeatures } from '../../common/decorators/require-features.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('company-policy')
@UseGuards(RolesGuard)
export class CompanyPoliciesController {
  constructor(private readonly service: CompanyPoliciesService) {}

  @Get()
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async get(@CurrentUser() user: JwtPayload) {
    return { data: await this.service.getEffectivePolicy(user.companyId!) };
  }

  @Patch('attendance')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @RequireFeatures('attendance')
  async updateAttendance(
    @Body() dto: UpdateAttendancePolicyDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const data = await this.service.updateAttendancePolicy(
      user.companyId!,
      user.sub,
      user.role,
      dto,
    );
    return { data };
  }

  @Patch('payroll')
  @Roles('COMPANY_OWNER')
  @RequireFeatures('payroll')
  async updatePayroll(
    @Body() dto: UpdatePayrollPolicyDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const data = await this.service.updatePayrollPolicy(
      user.companyId!,
      user.sub,
      user.role,
      dto,
    );
    return { data };
  }
}
