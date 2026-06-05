import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Holiday, HolidaySchema } from './schemas/holiday.schema';
import { HolidaysRepository } from './holidays.repository';
import { HolidaysService } from './holidays.service';
import { HolidaysController } from './holidays.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Holiday.name, schema: HolidaySchema }])],
  providers: [HolidaysRepository, HolidaysService],
  controllers: [HolidaysController],
  exports: [HolidaysRepository, HolidaysService],
})
export class HolidaysModule {}
