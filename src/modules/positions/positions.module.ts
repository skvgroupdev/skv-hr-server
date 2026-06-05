import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Position, PositionSchema } from './schemas/position.schema';
import { PositionsRepository } from './positions.repository';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { AuditLogModule } from '../audit-logs/audit-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Position.name, schema: PositionSchema }]),
    AuditLogModule,
  ],
  providers: [PositionsRepository, PositionsService],
  controllers: [PositionsController],
  exports: [PositionsRepository],
})
export class PositionsModule {}
