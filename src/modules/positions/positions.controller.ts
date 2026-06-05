import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionQueryDto } from './dto/position-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('positions')
@UseGuards(RolesGuard)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async create(@Body() dto: CreatePositionDto, @CurrentUser() user: JwtPayload) {
    const position = await this.positionsService.create(
      user.companyId!,
      dto,
      user.sub,
      user.role,
    );
    return { data: position };
  }

  @Get()
  async list(@Query() query: PositionQueryDto, @CurrentUser() user: JwtPayload) {
    return this.positionsService.list(user.companyId!, query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const position = await this.positionsService.getOne(user.companyId!, id);
    return { data: position };
  }

  @Patch(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePositionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const position = await this.positionsService.update(
      user.companyId!,
      id,
      dto,
      user.sub,
      user.role,
    );
    return { data: position };
  }

  @Delete(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const position = await this.positionsService.softDelete(
      user.companyId!,
      id,
      user.sub,
      user.role,
    );
    return { data: position };
  }
}
