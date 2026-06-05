import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('plans')
@UseGuards(RolesGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  async create(@Body() dto: CreatePlanDto) {
    const plan = await this.plansService.create(dto);
    return { data: plan };
  }

  @Get()
  async findAll() {
    const plans = await this.plansService.findAll();
    return { data: plans };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const plan = await this.plansService.findOne(id);
    return { data: plan };
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN')
  async update(@Param('id') id: string, @Body() dto: Partial<CreatePlanDto>) {
    const plan = await this.plansService.update(id, dto);
    return { data: plan };
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string) {
    const plan = await this.plansService.softDelete(id);
    return { data: plan };
  }
}
