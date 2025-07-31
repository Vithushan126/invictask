import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password';
import { ForgotPasswordDto } from './dto/forgot-password';
import { ResetPasswordDto } from './dto/reset-password';

@Controller()
export class AuthServiceController {
  constructor(private authServiceService: AuthServiceService) {}

  @MessagePattern('register')
  register(@Payload() data: RegisterDto) {
    return this.authServiceService.register(data.email, data.password);
  }

  @MessagePattern('login')
  login(@Payload() data: LoginDto) {
    return this.authServiceService.login(data.email, data.password);
  }

  @MessagePattern('change_password')
  changePassword(@Payload() data: ChangePasswordDto) {
    return this.authServiceService.changePassword(
      data.email,
      data.oldPassword,
      data.newPassword,
    );
  }

  @MessagePattern('forgot_password')
  forgotPassword(@Payload() data: ForgotPasswordDto) {
    return this.authServiceService.forgotPassword(data.email);
  }

  @MessagePattern('reset_password')
  resetPassword(@Payload() data: ResetPasswordDto) {
    return this.authServiceService.resetPassword(data.token, data.newPassword);
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(@Payload() userId: number) {
    return this.authServiceService.getUserById(userId);
  }
}
