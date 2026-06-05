import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AnnouncementsRepository } from './announcements.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

const MAX_LIMIT = 100;

@Injectable()
export class AnnouncementsService {
  constructor(
    private readonly announcementsRepository: AnnouncementsRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(tenantId: string, userId: string, dto: CreateAnnouncementDto) {
    return this.announcementsRepository.create({
      tenantId: new Types.ObjectId(tenantId),
      createdBy: new Types.ObjectId(userId),
      title: dto.title,
      content: dto.content,
      targetType: dto.targetType ?? 'ALL',
      targetIds: dto.targetIds?.map((id) => new Types.ObjectId(id)) ?? [],
      isPinned: dto.isPinned ?? false,
    });
  }

  async findAll(tenantId: string, page = 1, limit = 20) {
    const safeLimit = Math.min(MAX_LIMIT, limit);
    const { items, total } = await this.announcementsRepository.findAll(
      new Types.ObjectId(tenantId),
      page,
      safeLimit,
    );
    return { data: items, meta: { page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
  }

  async findOne(tenantId: string, id: string) {
    const item = await this.announcementsRepository.findById(id, new Types.ObjectId(tenantId));
    if (!item) throw new NotFoundException('Announcement not found');
    return item;
  }

  async update(tenantId: string, id: string, dto: UpdateAnnouncementDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.announcementsRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Announcement not found');
    const updateData: Partial<import('./schemas/announcement.schema').Announcement> = {
      ...dto,
      targetIds: dto.targetIds?.map((id) => new Types.ObjectId(id)) ?? undefined,
    };
    return this.announcementsRepository.update(id, tenantObjectId, updateData);
  }

  async delete(tenantId: string, id: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.announcementsRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Announcement not found');
    return this.announcementsRepository.softDelete(id, tenantObjectId);
  }

  async publish(tenantId: string, id: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.announcementsRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Announcement not found');
    return this.announcementsRepository.update(id, tenantObjectId, {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    });
  }

  async getMobileFeed(tenantId: string, page = 1, limit = 20) {
    const safeLimit = Math.min(MAX_LIMIT, limit);
    const { items, total } = await this.announcementsRepository.findPublishedFeed(
      new Types.ObjectId(tenantId),
      page,
      safeLimit,
    );
    return { data: items, meta: { page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
  }

  async markRead(id: string, userId: string) {
    return this.announcementsRepository.markRead(id, new Types.ObjectId(userId));
  }
}
