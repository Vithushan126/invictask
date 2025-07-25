import {
  Controller,
  Post,
  Body,
  Res,
  Inject,
  UseFilters,
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
      if (error && typeof error === 'object' && 'message' in error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Registration failed');
    }
  }

  @Post('login')
  async login(@Body() body: any, @Res() res: Response) {
    try {
      const { access_token } = await this.authClient
        .send('login', body)
        .toPromise();
      res
        .cookie('jwt', access_token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .send({ message: 'Logged in', access_token });
    } catch (error) {
      console.log(error);

      if (error && typeof error === 'object' && 'message' in error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Login failed');
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
      const result = await this.authClient
        .send('change_password', body)
        .toPromise();
      res.status(200).send(result);
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Change password failed');
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.authClient
        .send('forgot_password', body)
        .toPromise();
      res.status(200).send(result);
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Forgot password failed');
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.authClient
        .send('reset_password', body)
        .toPromise();
      res.status(200).send(result);
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Reset password failed');
    }
  }
}
