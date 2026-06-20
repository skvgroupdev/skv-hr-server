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
  ForbiddenException,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchQueryDto } from './dto/branch-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('branches')
@UseGuards(RolesGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async create(@Body() dto: CreateBranchDto, @CurrentUser() user: JwtPayload) {
    const branch = await this.branchesService.create(
      user.companyId!,
      dto,
      user.sub,
      user.role,
    );
    return { data: branch };
  }

  @Get()
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async list(@Query() query: BranchQueryDto, @CurrentUser() user: JwtPayload) {
    return this.branchesService.list(user.companyId!, query);
  }

  @Get(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER')
  async getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const branch = await this.branchesService.getOne(user.companyId!, id);
    return { data: branch };
  }

  @Patch(':id')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const branch = await this.branchesService.update(
      user.companyId!,
      id,
      dto,
      user.sub,
      user.role,
    );
    return { data: branch };
  }

  @Delete(':id')
  @Roles('COMPANY_OWNER')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const branch = await this.branchesService.softDelete(
      user.companyId!,
      id,
      user.sub,
      user.role,
    );
    return { data: branch };
  }

  @Post(':id/activate')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const branch = await this.branchesService.activate(
      user.companyId!,
      id,
      user.sub,
      user.role,
    );
    return { data: branch };
  }

  @Post(':id/deactivate')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const branch = await this.branchesService.deactivate(
      user.companyId!,
      id,
      user.sub,
      user.role,
    );
    return { data: branch };
  }

  @Post(':id/manager')
  @Roles('COMPANY_OWNER', 'HR_ADMIN')
  async assignManager(
    @Param('id') id: string,
    @Body() body: { employeeId: string },
    @CurrentUser() user: JwtPayload,
  ) {
    const branch = await this.branchesService.assignManager(
      user.companyId!,
      id,
      body.employeeId,
      user.sub,
      user.role,
    );
    return { data: branch };
  }
}
