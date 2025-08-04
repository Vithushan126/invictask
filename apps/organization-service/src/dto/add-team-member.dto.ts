import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddTeamMemberDto {
  @IsString({ message: 'Team ID must be a string' })
  @IsNotEmpty({ message: 'Team ID must not be empty' })
  teamId: string;

  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID must not be empty' })
  userId: string;

  @IsOptional()
  @IsIn(['lead', 'member'], {
    message: 'Role must be either "lead" or "member"',
  })
  role?: 'lead' | 'member';
}
