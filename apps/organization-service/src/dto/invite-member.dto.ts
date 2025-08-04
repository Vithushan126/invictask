import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InviteMemberDto {
  @IsString({ message: 'Organization ID must be a string' })
  @IsNotEmpty({ message: 'Organization ID must not be empty' })
  organizationId: string;

  @IsString({ message: 'Invited by user ID must be a string' })
  @IsNotEmpty({ message: 'Invited by user ID must not be empty' })
  invitedByUserId: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
