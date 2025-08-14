import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MemberDto {
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID must not be empty' })
  userId: string;

  @IsOptional()
  @IsIn(['lead', 'member'], {
    message: 'Role must be either "lead" or "member"',
  })
  role?: 'lead' | 'member';
}

export class AddTeamMembersDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'Members must not be empty' })
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members: MemberDto[];
}
