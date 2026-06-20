export declare class CreateAnnouncementDto {
    title: string;
    content: string;
    targetType?: 'ALL' | 'BRANCH' | 'DEPARTMENT' | 'ROLE';
    targetIds?: string[];
    isPinned?: boolean;
}
