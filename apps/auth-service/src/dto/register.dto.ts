import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'password must not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
