import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString({ message: 'Organization name must be a string' })
  @IsNotEmpty({ message: 'Organization name must not be empty' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Organization name must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'logoUrl URL must be a string' })
  logoUrl?: string;

  @IsNumber({}, { message: 'User ID must be a number' })
  ownerId: string;
}
