import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendanceAdjustmentsService } from './attendance-adjustments.service';
import { CreateAttendanceAdjustmentDto } from './dto/create-attendance-adjustment.dto';
import {
  RejectAttendanceAdjustmentDto,
  ReviewAttendanceAdjustmentDto,
} from './dto/review-attendance-adjustment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequireFeatures } from '../../common/decorators/require-features.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import type { AttendanceAdjustment } from './schemas/attendance-adjustment.schema';

@Controller('attendance-adjustments')
@UseGuards(RolesGuard)
@RequireFeatures('attendanceAdjustment')
export class AttendanceAdjustmentsController {
  constructor(private readonly service: AttendanceAdjustmentsService) {}

  @Post()
  @Roles('STAFF', 'SUPERVISOR', 'BRANCH_MANAGER')
  async create(
    @Body() dto: CreateAttendanceAdjustmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return { data: await this.service.create(user, dto) };
  }

  @Get('my')
  async mine(@CurrentUser() user: JwtPayload) {
    return { data: await this.service.getMine(user) };
  }

  @Get()
  @Roles('HR_ADMIN', 'COMPANY_OWNER', 'BRANCH_MANAGER')
  async list(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: AttendanceAdjustment['status'],
  ) {
    return { data: await this.service.listForReviewer(user, status) };
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return { data: await this.service.cancel(user, id) };
  }

  @Post(':id/approve')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async approve(
    @Param('id') id: string,
    @Body() dto: ReviewAttendanceAdjustmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return { data: await this.service.approve(user, id, dto.comment) };
  }

  @Post(':id/reject')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectAttendanceAdjustmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return { data: await this.service.reject(user, id, dto.reason) };
  }
}
