import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptInviteDto {
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token must not be empty' })
  token: string;

  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID must not be empty' })
  userId: string;
}
