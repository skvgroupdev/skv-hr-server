import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';
import {
  QueryPayslipsDto,
  QueryEmployeePayslipsDto,
} from './dto/query-payslips.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { RequireFeatures } from '../../common/decorators/require-features.decorator';
import { UpdatePayslipAdjustmentsDto } from './dto/update-payslip-adjustments.dto';
import { UpdatePayrollPolicyDto } from './dto/update-payroll-policy.dto';

@Controller('payroll')
@UseGuards(RolesGuard)
@RequireFeatures('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('periods')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async createPeriod(
    @Body() dto: CreatePayrollPeriodDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const period = await this.payrollService.createPeriod(
      user.companyId!,
      user.sub,
      dto,
    );
    return { data: period };
  }

  @Get('periods')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async listPeriods(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.payrollService.listPeriods(
      user.companyId!,
      parseInt(page ?? '1', 10),
      parseInt(limit ?? '20', 10),
    );
  }

  @Get('periods/:id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getPeriod(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const period = await this.payrollService.getPeriod(user.companyId!, id);
    return { data: period };
  }

  // DRAFT → GENERATED
  @Post('periods/:id/generate')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async generatePayroll(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const period = await this.payrollService.generatePayroll(
      user.companyId!,
      id,
      user.sub,
    );
    return { data: period };
  }

  // GENERATED → HR_REVIEWED
  @Post('periods/:id/hr-review')
  @Roles('HR_ADMIN', 'COMPANY_OWNER')
  @HttpCode(HttpStatus.OK)
  async hrReviewPeriod(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const period = await this.payrollService.hrReviewPeriod(
      user.companyId!,
      id,
      user.sub,
    );
    return { data: period };
  }

  // HR_REVIEWED → PAID
  @Post('periods/:id/pay')
  @Roles('COMPANY_OWNER')
  @HttpCode(HttpStatus.OK)
  async payPeriod(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const period = await this.payrollService.payPeriod(
      user.companyId!,
      id,
      user.sub,
    );
    return { data: period };
  }

  @Get('periods/:id/payslips')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getPeriodPayslips(
    @Param('id') id: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.payrollService.getPeriodPayslips(
      user.companyId!,
      id,
      parseInt(page ?? '1', 10),
      parseInt(limit ?? '20', 10),
    );
  }

  @Get('payslips')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getAllPayslips(
    @Query() query: QueryPayslipsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.payrollService.getAllPayslips(user.companyId!, {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 20,
      sort: query.sort ?? '-createdAt',
      periodId: query.periodId,
      status: query.status,
      search: query.search,
      startDate: query.startDate,
      endDate: query.endDate,
    });
  }

  @Get('payslips/:id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getPayslipById(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const data = await this.payrollService.getPayslipById(user.companyId!, id);
    return { data };
  }

  @Patch('payslips/:id/adjustments')
  @Roles('HR_ADMIN')
  async updatePayslipAdjustments(
    @Param('id') id: string,
    @Body() dto: UpdatePayslipAdjustmentsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return {
      data: await this.payrollService.updatePayslipAdjustments(
        user.companyId!,
        id,
        user.sub,
        dto,
      ),
    };
  }

  @Get('employees/:employeeId/payslips')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getEmployeePayslips(
    @Param('employeeId') employeeId: string,
    @Query() query: QueryEmployeePayslipsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.payrollService.getEmployeePayslips(
      user.companyId!,
      employeeId,
      {
        page: query.page ? parseInt(query.page, 10) : 1,
        limit: query.limit ? parseInt(query.limit, 10) : 20,
      },
    );
  }

  @Get('employees/:employeeId/finance-summary')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getEmployeeFinanceSummary(
    @Param('employeeId') employeeId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const data = await this.payrollService.getEmployeeFinanceSummary(
      user.companyId!,
      employeeId,
    );
    return { data };
  }

  @Get('my-payslips')
  async getMyPayslips(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.payrollService.getMyPayslips(
      user.companyId!,
      user.sub,
      parseInt(page ?? '1', 10),
      parseInt(limit ?? '20', 10),
    );
  }

  @Get('my-payslips/:id')
  async getMyPayslip(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const payslip = await this.payrollService.getMyPayslip(
      user.companyId!,
      user.sub,
      id,
    );
    return { data: payslip };
  }

  @Get('report')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getReport(
    @Query('periodId') periodId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const data = await this.payrollService.getReport(user.companyId!, periodId);
    return { data };
  }

  @Get('policy')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async getPolicy(@CurrentUser() user: JwtPayload) {
    const data = await this.payrollService.getPayrollPolicy(user.companyId!);
    return { data };
  }

  @Patch('policy')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async updatePolicy(
    @Body() dto: UpdatePayrollPolicyDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const data = await this.payrollService.updatePayrollPolicy(
      user.companyId!,
      user.sub,
      user.role,
      dto,
    );
    return { data };
  }
}
