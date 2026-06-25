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
import { IsEnum } from 'class-validator';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

class ChangeRoleDto {
  @IsEnum(['HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR', 'STAFF'])
  role: 'HR_ADMIN' | 'BRANCH_MANAGER' | 'SUPERVISOR' | 'STAFF';
}

@Controller('employees')
@UseGuards(RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async create(@Body() dto: CreateEmployeeDto, @CurrentUser() user: JwtPayload) {
    const employee = await this.employeesService.create(user, dto);
    return { data: employee };
  }

  @Get()
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR')
  async list(@Query() query: EmployeeQueryDto, @CurrentUser() user: JwtPayload) {
    return this.employeesService.list(user, query);
  }

  @Get(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR', 'STAFF')
  async getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const employee = await this.employeesService.getOne(user, id);
    return { data: employee };
  }

  @Patch('me')
  async updateMyProfile(@Body() dto: UpdateMyProfileDto, @CurrentUser() user: JwtPayload) {
    const employee = await this.employeesService.updateMyProfile(user, dto);
    return { data: employee };
  }

  @Patch(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const employee = await this.employeesService.update(user, id, dto);
    return { data: employee };
  }

  @Patch(':id/role')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  changeRole(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: ChangeRoleDto,
  ) {
    return this.employeesService.changeRole(user, id, dto.role);
  }

  @Delete(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const result = await this.employeesService.softDelete(user, id);
    return { data: result };
  }

  @Post(':id/deactivate')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const employee = await this.employeesService.deactivate(user, id);
    return { data: employee };
  }

  @Post(':id/reactivate')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async reactivate(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const employee = await this.employeesService.reactivate(user, id);
    return { data: employee };
  }

  @Post(':id/upload-document')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async uploadDocument(
    @Param('id') id: string,
    @Body() dto: UploadDocumentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const document = await this.employeesService.uploadDocument(user, id, dto);
    return { data: document };
  }

  @Get(':id/documents')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'STAFF')
  async getDocuments(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const documents = await this.employeesService.getDocuments(user, id);
    return { data: documents };
  }

  @Patch(':id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.employeesService.changePassword(user, id, dto);
    return { data: result };
  }
}
