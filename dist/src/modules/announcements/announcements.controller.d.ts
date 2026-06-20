import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    create(dto: CreateAnnouncementDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(page: string, limit: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMobileFeed(page: string, limit: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, dto: UpdateAnnouncementDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    delete(id: string, user: JwtPayload): Promise<{
        data: {
            deleted: boolean;
        };
    }>;
    publish(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    markRead(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/announcement.schema").Announcement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/announcement.schema").Announcement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
}
