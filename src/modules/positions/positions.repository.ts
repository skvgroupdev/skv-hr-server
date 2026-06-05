import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Position, PositionDocument } from './schemas/position.schema';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

interface PaginatedPositions {
  positions: PositionDocument[];
  total: number;
}

@Injectable()
export class PositionsRepository {
  constructor(
    @InjectModel(Position.name) private readonly positionModel: Model<PositionDocument>,
  ) {}

  async create(tenantId: Types.ObjectId, dto: CreatePositionDto): Promise<PositionDocument> {
    return this.positionModel.create({ ...dto, tenantId });
  }

  async findById(id: string, tenantId: Types.ObjectId): Promise<PositionDocument | null> {
    return this.positionModel.findOne({ _id: id, tenantId }).exec();
  }

  async findPaginated(
    tenantId: Types.ObjectId,
    page: number,
    limit: number,
    sort: string,
  ): Promise<PaginatedPositions> {
    const skip = (page - 1) * limit;
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    const sortField = sort.replace(/^-/, '');
    const query = { tenantId };

    const [positions, total] = await Promise.all([
      this.positionModel.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).exec(),
      this.positionModel.countDocuments(query).exec(),
    ]);

    return { positions, total };
  }

  async update(
    id: string,
    tenantId: Types.ObjectId,
    dto: UpdatePositionDto,
  ): Promise<PositionDocument | null> {
    return this.positionModel
      .findOneAndUpdate({ _id: id, tenantId }, dto, { returnDocument: 'after' })
      .exec();
  }

  async softDelete(id: string, tenantId: Types.ObjectId): Promise<PositionDocument | null> {
    return this.positionModel
      .findOneAndUpdate({ _id: id, tenantId }, { isActive: false }, { returnDocument: 'after' })
      .exec();
  }
}
