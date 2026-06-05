import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Holiday, HolidayDocument } from './schemas/holiday.schema';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';

@Injectable()
export class HolidaysRepository {
  constructor(@InjectModel(Holiday.name) private readonly holidayModel: Model<HolidayDocument>) {}

  create(tenantId: Types.ObjectId, dto: CreateHolidayDto): Promise<HolidayDocument> {
    return this.holidayModel.create({ ...dto, tenantId, date: new Date(dto.date) });
  }

  findAll(tenantId: Types.ObjectId, year?: number): Promise<HolidayDocument[]> {
    const filter: Record<string, unknown> = { tenantId, isActive: true };
    if (year) {
      filter.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      };
    }
    return this.holidayModel.find(filter).sort({ date: 1 }).exec();
  }

  findById(id: string, tenantId: Types.ObjectId): Promise<HolidayDocument | null> {
    return this.holidayModel.findOne({ _id: id, tenantId }).exec();
  }

  update(id: string, tenantId: Types.ObjectId, dto: UpdateHolidayDto): Promise<HolidayDocument | null> {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.date) updateData.date = new Date(dto.date);
    return this.holidayModel.findOneAndUpdate({ _id: id, tenantId }, updateData, { returnDocument: 'after' }).exec();
  }

  softDelete(id: string, tenantId: Types.ObjectId): Promise<HolidayDocument | null> {
    return this.holidayModel.findOneAndUpdate({ _id: id, tenantId }, { isActive: false }, { returnDocument: 'after' }).exec();
  }

  findByDateRange(tenantId: Types.ObjectId, startDate: Date, endDate: Date): Promise<HolidayDocument[]> {
    return this.holidayModel.find({ tenantId, isActive: true, date: { $gte: startDate, $lte: endDate } }).exec();
  }
}
