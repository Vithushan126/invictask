import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { firstValueFrom } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  // 🟢 Create User Profile
  @Post('/profile')
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
  @Get('/profile')
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
  @Get('/profile/:id')
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
  @Post('/profile/:id')
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
  @Delete('/profile/:id')
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
