import {
  Controller,
  Post,
  Body,
  Res,
  Inject,
  HttpStatus,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class ApiGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('AUTH_SERVICE') private fileClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {}

  //Auth-service
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
      const { access_token, user } = await firstValueFrom(
        this.authClient.send('login', body),
      );
      res
        .cookie('jwt', access_token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .send({ message: 'Successfully logged in.', access_token, user });
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

  //file-service
  @Post('file/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    try {
      const base64File = file.buffer.toString('base64');

      const payload = {
        file: {
          buffer: base64File,
          originalname: file.originalname,
          mimetype: file.mimetype,
        },
        folder,
      };

      const result = await firstValueFrom(
        this.fileClient.send({ cmd: 'upload_file' }, payload),
      );

      return { message: 'File uploaded successfully', result };
    } catch (error) {
      this.handleError(error, 'File upload failed');
    }
  }

  @Delete('file/delete/:publicId')
  async deleteFile(@Param('publicId') publicId: string) {
    try {
      const result = await firstValueFrom(
        this.fileClient.send({ cmd: 'delete_file' }, publicId),
      );
      return { message: 'File deleted successfully', result };
    } catch (error) {
      this.handleError(error, 'File deletion failed');
    }
  }

  @Post('file/replace')
  @UseInterceptors(FileInterceptor('file'))
  async replaceFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { oldPublicId: string; folder?: string },
  ) {
    try {
      const base64File = file.buffer.toString('base64');

      const payload = {
        oldPublicId: body.oldPublicId,
        folder: body.folder,
        file: {
          buffer: base64File,
          originalname: file.originalname,
          mimetype: file.mimetype,
        },
      };

      const result = await firstValueFrom(
        this.fileClient.send({ cmd: 'replace_file' }, payload),
      );

      return { message: 'File replaced successfully', result };
    } catch (error) {
      this.handleError(error, 'File replace failed');
    }
  }

  //User-service
  // 🟢 Create User Profile
  @Post('user/profile')
  @UseInterceptors(FileInterceptor('file'))
  async createUserProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() userData: any,
  ) {
    try {
      const payload = {
        user: userData,
        file: file
          ? {
              buffer: file.buffer.toString('base64'),
              originalname: file.originalname,
              mimetype: file.mimetype,
            }
          : undefined,
      };

      const result = await firstValueFrom(
        this.userClient.send('user_create', payload),
      );
      return { message: 'User profile created', result };
    } catch (error) {
      this.handleError(error, 'Create user profile failed');
    }
  }

  // 🟡 Get All User Profiles
  @Get('user/profile')
  async getAllProfiles() {
    try {
      const result = await firstValueFrom(
        this.userClient.send('user_get_all', {}),
      );
      return result;
    } catch (error) {
      this.handleError(error, 'Fetch user profiles failed');
    }
  }

  // 🔵 Get Profile by ID
  @Get('user/profile/:id')
  async getProfileById(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.userClient.send('user_get_by_id', id),
      );
      return result;
    } catch (error) {
      this.handleError(error, 'Fetch user profile failed');
    }
  }

  // 🟠 Update User Profile
  @Post('user/profile/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateData: any,
  ) {
    try {
      const payload = {
        id,
        data: updateData,
      };

      if (file) {
        payload.data.file = {
          buffer: file.buffer.toString('base64'),
          originalname: file.originalname,
          mimetype: file.mimetype,
        };
      }

      const result = await firstValueFrom(
        this.userClient.send('user_update', payload),
      );
      return { message: 'User profile updated', result };
    } catch (error) {
      this.handleError(error, 'Update user profile failed');
    }
  }

  // 🔴 Delete User Profile
  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.userClient.send('user_delete', id),
      );
      return { message: 'User profile deleted', result };
    } catch (error) {
      this.handleError(error, 'Delete user profile failed');
    }
  }

  private handleError(error: any, fallbackMessage: string) {
    if (error && typeof error === 'object' && 'message' in error) {
      throw new BadRequestException(error.message);
    }
    throw new BadRequestException(fallbackMessage);
  }
}
