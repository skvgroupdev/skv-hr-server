import { Types } from 'mongoose';
import { AnnouncementsRepository } from './announcements.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
export declare class AnnouncementsService {
    private readonly announcementsRepository;
    private readonly notificationsService;
    constructor(announcementsRepository: AnnouncementsRepository, notificationsService: NotificationsService);
    create(tenantId: string, userId: string, dto: CreateAnnouncementDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenantId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(tenantId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenantId: string, id: string, dto: UpdateAnnouncementDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    delete(tenantId: string, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    publish(tenantId: string, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getMobileFeed(tenantId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    markRead(id: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
