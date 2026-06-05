import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema';

const MAX_LIMIT = 100;

@Injectable()
export class AnnouncementsRepository {
  constructor(
    @InjectModel(Announcement.name) private readonly model: Model<AnnouncementDocument>,
  ) {}

  create(data: Partial<Announcement>): Promise<AnnouncementDocument> {
    return this.model.create(data);
  }

  findById(id: string, tenantId: Types.ObjectId): Promise<AnnouncementDocument | null> {
    return this.model.findOne({ _id: id, tenantId }).exec();
  }

  async findAll(tenantId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.model.find({ tenantId }).sort({ isPinned: -1, createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.model.countDocuments({ tenantId }).exec(),
    ]);
    return { items, total };
  }

  async findPublishedFeed(tenantId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.model
        .find({ tenantId, status: 'PUBLISHED' })
        .sort({ isPinned: -1, publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments({ tenantId, status: 'PUBLISHED' }).exec(),
    ]);
    return { items, total };
  }

  update(id: string, tenantId: Types.ObjectId, data: Partial<Announcement>): Promise<AnnouncementDocument | null> {
    return this.model.findOneAndUpdate({ _id: id, tenantId }, data, { returnDocument: 'after' }).exec();
  }

  softDelete(id: string, tenantId: Types.ObjectId): Promise<AnnouncementDocument | null> {
    return this.model.findOneAndDelete({ _id: id, tenantId }).exec();
  }

  markRead(id: string, userId: Types.ObjectId): Promise<AnnouncementDocument | null> {
    return this.model.findByIdAndUpdate(
      id,
      { $addToSet: { readBy: userId } },
      { returnDocument: 'after' },
    ).exec();
  }
}
