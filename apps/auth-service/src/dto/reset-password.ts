import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
   @IsNotEmpty({ message: 'Token must not be empty' })
  token: string;

   @IsNotEmpty({ message: 'New password must not be empty' })
    @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}
