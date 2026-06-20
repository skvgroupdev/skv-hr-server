import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shift, ShiftSchema } from './schemas/shift.schema';
import {
  ShiftAssignment,
  ShiftAssignmentSchema,
} from './schemas/shift-assignment.schema';
import { ShiftsRepository } from './shifts.repository';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shift.name, schema: ShiftSchema },
      { name: ShiftAssignment.name, schema: ShiftAssignmentSchema },
    ]),
    EmployeesModule,
  ],
  providers: [ShiftsRepository, ShiftsService],
  controllers: [ShiftsController],
  exports: [ShiftsRepository, ShiftsService],
})
export class ShiftsModule {}
