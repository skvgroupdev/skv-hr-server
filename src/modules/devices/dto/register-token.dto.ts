import { IsString, IsEnum } from 'class-validator';

export class RegisterTokenDto {
  @IsString()
  token: string;

  @IsEnum(['ios', 'android', 'web'])
  platform: 'ios' | 'android' | 'web';
}
