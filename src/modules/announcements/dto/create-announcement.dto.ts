import { IsString, IsOptional, IsEnum, IsArray, IsBoolean } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(['ALL', 'BRANCH', 'DEPARTMENT', 'ROLE'])
  targetType?: 'ALL' | 'BRANCH' | 'DEPARTMENT' | 'ROLE';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetIds?: string[];

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
