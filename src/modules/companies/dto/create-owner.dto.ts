import { IsString, MinLength, Matches } from 'class-validator';

export class CreateOwnerDto {
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'phone must be in E.164 format' })
  phone: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(8)
  password: string;
}
