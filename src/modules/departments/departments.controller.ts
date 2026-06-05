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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentQueryDto } from './dto/department-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('departments')
@UseGuards(RolesGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async create(@Body() dto: CreateDepartmentDto, @CurrentUser() user: JwtPayload) {
    const department = await this.departmentsService.create(
      user.companyId!,
      dto,
      user.sub,
      user.role,
    );
    return { data: department };
  }

  @Get()
  async list(@Query() query: DepartmentQueryDto, @CurrentUser() user: JwtPayload) {
    return this.departmentsService.list(user.companyId!, query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const department = await this.departmentsService.getOne(user.companyId!, id);
    return { data: department };
  }

  @Patch(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const department = await this.departmentsService.update(
      user.companyId!,
      id,
      dto,
      user.sub,
      user.role,
    );
    return { data: department };
  }

  @Delete(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const department = await this.departmentsService.softDelete(
      user.companyId!,
      id,
      user.sub,
      user.role,
    );
    return { data: department };
  }
}
