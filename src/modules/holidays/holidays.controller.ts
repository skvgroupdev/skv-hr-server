import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { HolidayQueryDto } from './dto/holiday-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('holidays')
@UseGuards(RolesGuard)
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Post()
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async create(@Body() dto: CreateHolidayDto, @CurrentUser() user: JwtPayload) {
    const holiday = await this.holidaysService.create(user.companyId!, dto);
    return { data: holiday };
  }

  @Get()
  async findAll(@Query() query: HolidayQueryDto, @CurrentUser() user: JwtPayload) {
    return this.holidaysService.findAll(user.companyId!, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const holiday = await this.holidaysService.findOne(user.companyId!, id);
    return { data: holiday };
  }

  @Patch(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async update(@Param('id') id: string, @Body() dto: UpdateHolidayDto, @CurrentUser() user: JwtPayload) {
    const holiday = await this.holidaysService.update(user.companyId!, id, dto);
    return { data: holiday };
  }

  @Delete(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const holiday = await this.holidaysService.softDelete(user.companyId!, id);
    return { data: holiday };
  }
}
