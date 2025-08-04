import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString({ message: 'Team name must be a string' })
  @IsNotEmpty({ message: 'Team name must not be empty' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsString({ message: 'Organization ID must be a string' })
  @IsNotEmpty({ message: 'Organization ID must not be empty' })
  organizationId: string;
}
