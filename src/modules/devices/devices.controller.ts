import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RegisterTokenDto } from './dto/register-token.dto';
import { RemoveTokenDto } from './dto/remove-token.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('devices')
@UseGuards(RolesGuard)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register-token')
  @HttpCode(HttpStatus.OK)
  async registerToken(@Body() dto: RegisterTokenDto, @CurrentUser() user: JwtPayload) {
    const token = await this.devicesService.registerToken(user.companyId!, user.sub, dto);
    return { data: token };
  }

  @Post('remove-token')
  @HttpCode(HttpStatus.OK)
  async removeToken(@Body() dto: RemoveTokenDto) {
    return this.devicesService.removeToken(dto);
  }
}
