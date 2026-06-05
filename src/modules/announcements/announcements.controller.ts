import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('announcements')
@UseGuards(RolesGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async create(@Body() dto: CreateAnnouncementDto, @CurrentUser() user: JwtPayload) {
    const item = await this.announcementsService.create(user.companyId!, user.sub, dto);
    return { data: item };
  }

  @Get()
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.announcementsService.findAll(
      user.companyId!,
      parseInt(page ?? '1', 10),
      parseInt(limit ?? '20', 10),
    );
  }

  @Get('mobile/feed')
  async getMobileFeed(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.announcementsService.getMobileFeed(
      user.companyId!,
      parseInt(page ?? '1', 10),
      parseInt(limit ?? '20', 10),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const item = await this.announcementsService.findOne(user.companyId!, id);
    return { data: item };
  }

  @Patch(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto, @CurrentUser() user: JwtPayload) {
    const item = await this.announcementsService.update(user.companyId!, id, dto);
    return { data: item };
  }

  @Delete(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    await this.announcementsService.delete(user.companyId!, id);
    return { data: { deleted: true } };
  }

  @Post(':id/publish')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async publish(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const item = await this.announcementsService.publish(user.companyId!, id);
    return { data: item };
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  async markRead(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const item = await this.announcementsService.markRead(id, user.sub);
    return { data: item };
  }
}
