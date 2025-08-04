import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { firstValueFrom } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'apps/auth-service/src/entity/user.entity';
import type { Express } from 'express';

@Injectable()
export class UserServiceService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userRepo: Repository<UserProfile>,

    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,

    @Inject('FILE_SERVICE')
    private readonly fileClient: ClientProxy,
  ) {}

  async create(data: CreateUserDto, file?: Express.Multer.File) {
    const user: User | null = await firstValueFrom(
      this.authClient.send('get_user_by_id', data?.userId),
    );

    if (!user)
      throw new RpcException({
        statusCode: 404,
        message: 'User not found in auth-service',
      });

    const profile = this.userRepo.create(data);

    if (file) {
      const avatarUrl = await this.uploadAvatarToFileService(file, 'avatars');
      profile.avatarUrl = avatarUrl;
    }

    return this.userRepo.save(profile);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: string) {
    return this.userRepo.findOne({ where: { id: Number(id) } });
  }

  async update(id: string, dto: UpdateUserDto, file?: Express.Multer.File) {
    const profile = await this.findOne(id);
    if (!profile) throw new Error('Profile not found');

    if (file) {
      if (profile.avatarUrl) {
        const publicId = this.extractPublicId(profile.avatarUrl);
        await this.deleteFromFileService(publicId);
      }

      const avatarUrl = await this.uploadAvatarToFileService(file, 'avatars');
      dto.avatarUrl = avatarUrl;
    }

    return this.userRepo.save({ ...profile, ...dto });
  }

  async remove(id: string) {
    const profile = await this.findOne(id);

    if (!profile) {
      throw new Error(`UserProfile with id ${id} not found`);
    }

    if (profile?.avatarUrl) {
      const publicId = this.extractPublicId(profile.avatarUrl);
      await this.deleteFromFileService(publicId);
    }

    return this.userRepo.remove(profile);
  }

  private async uploadAvatarToFileService(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const payload = {
      file: {
        buffer: file.buffer.toString('base64'),
        originalname: file.originalname,
        mimetype: file.mimetype,
      },
      folder,
    };

    const result = await firstValueFrom(
      this.fileClient.send('upload_file', payload),
    );

    return result?.secure_url || result?.url || '';
  }

  private async deleteFromFileService(publicId: string) {
    await firstValueFrom(this.fileClient.send('delete_file', publicId));
  }

  private extractPublicId(url: string): string {
    // Assumes URL is like: https://res.cloudinary.com/xxx/image/upload/v1234567/avatars/abc123.jpg
    const parts = url.split('/');
    const folderAndFile = parts.slice(-2).join('/');
    return folderAndFile.replace(/\.[^/.]+$/, ''); // Remove file extension
  }
}
