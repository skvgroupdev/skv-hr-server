import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { HolidaysRepository } from './holidays.repository';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { HolidayQueryDto } from './dto/holiday-query.dto';

@Injectable()
export class HolidaysService {
  constructor(private readonly holidaysRepository: HolidaysRepository) {}

  async create(tenantId: string, dto: CreateHolidayDto) {
    return this.holidaysRepository.create(new Types.ObjectId(tenantId), dto);
  }

  async findAll(tenantId: string, query: HolidayQueryDto) {
    const year = query.year ? parseInt(query.year, 10) : undefined;
    const holidays = await this.holidaysRepository.findAll(new Types.ObjectId(tenantId), year);
    return { data: holidays };
  }

  async findOne(tenantId: string, id: string) {
    const holiday = await this.holidaysRepository.findById(id, new Types.ObjectId(tenantId));
    if (!holiday) throw new NotFoundException('Holiday not found');
    return holiday;
  }

  async update(tenantId: string, id: string, dto: UpdateHolidayDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.holidaysRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Holiday not found');
    return this.holidaysRepository.update(id, tenantObjectId, dto);
  }

  async softDelete(tenantId: string, id: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.holidaysRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Holiday not found');
    return this.holidaysRepository.softDelete(id, tenantObjectId);
  }
}
