import {
  Controller,
  Post,
  Body,
  Res,
  Inject,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class ApiGatewayController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('register')
  async register(@Body() body: any) {
    try {
      return await firstValueFrom(this.authClient.send('register', body));
    } catch (error) {
      this.handleError(error, 'Registration failed');
    }
  }

  @Post('login')
  async login(@Body() body: any, @Res() res: Response) {
    try {
      const { access_token } = await firstValueFrom(
        this.authClient.send('login', body),
      );
      res
        .cookie('jwt', access_token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .send({ message: 'Logged in', access_token });
    } catch (error) {
      this.handleError(error, 'Login failed');
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.send({ message: 'Logged out successfully' });
  }

  @Post('change-password')
  async changePassword(@Body() body: any, @Res() res: Response) {
    try {
      const result = await firstValueFrom(
        this.authClient.send('change_password', body),
      );
      res.status(200).send(result);
    } catch (error) {
      this.handleError(error, 'Change password failed');
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: any, @Res() res: Response) {
    try {
      const result = await firstValueFrom(
        this.authClient.send('forgot_password', body),
      );
      res.status(200).send(result);
    } catch (error) {
      this.handleError(error, 'Forgot password failed');
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: any, @Res() res: Response) {
    try {
      const result = await firstValueFrom(
        this.authClient.send('reset_password', body),
      );
      res.status(200).send(result);
    } catch (error) {
      this.handleError(error, 'Reset password failed');
    }
  }

  private handleError(error: any, fallbackMessage: string) {
    if (error && typeof error === 'object' && 'message' in error) {
      throw new BadRequestException(error.message);
    }
    throw new BadRequestException(fallbackMessage);
  }
}
