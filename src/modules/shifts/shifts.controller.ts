import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { AssignShiftDto } from './dto/assign-shift.dto';
import { BulkAssignShiftDto } from './dto/bulk-assign-shift.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { RequireFeatures } from '../../common/decorators/require-features.decorator';

@Controller()
@UseGuards(RolesGuard)
@RequireFeatures('shiftManagement')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post('shifts')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async create(@Body() dto: CreateShiftDto, @CurrentUser() user: JwtPayload) {
    const shift = await this.shiftsService.create(user.companyId!, dto);
    return { data: shift };
  }

  @Get('shifts')
  async findAll(@CurrentUser() user: JwtPayload) {
    const shifts = await this.shiftsService.findAll(user.companyId!);
    return { data: shifts };
  }

  @Get('shifts/:id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const shift = await this.shiftsService.findOne(user.companyId!, id);
    return { data: shift };
  }

  @Patch('shifts/:id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateShiftDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const shift = await this.shiftsService.update(user.companyId!, id, dto);
    return { data: shift };
  }

  @Delete('shifts/:id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const shift = await this.shiftsService.softDelete(user.companyId!, id);
    return { data: shift };
  }

  @Post('shifts/:id/assign')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignShiftDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const assignment = await this.shiftsService.assignToEmployee(
      user.companyId!,
      id,
      dto,
    );
    return { data: assignment };
  }

  @Get('employees/:id/shift')
  async getEmployeeShift(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const assignment = await this.shiftsService.getEmployeeShift(user, id);
    return { data: assignment };
  }

  @Get('employees/:id/shift/history')
  async getEmployeeShiftHistory(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const history = await this.shiftsService.getEmployeeShiftHistory(user, id);
    return { data: history };
  }

  @Post('shifts/bulk-assign')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async bulkAssign(
    @Body() dto: BulkAssignShiftDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.shiftsService.bulkAssignShift(user, dto);
    return { data: result };
  }
}
