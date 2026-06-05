import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from './schemas/branch.schema';
import { BranchesRepository } from './branches.repository';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { AuditLogModule } from '../audit-logs/audit-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Branch.name, schema: BranchSchema }]),
    AuditLogModule,
  ],
  providers: [BranchesRepository, BranchesService],
  controllers: [BranchesController],
  exports: [BranchesRepository],
})
export class BranchesModule {}
