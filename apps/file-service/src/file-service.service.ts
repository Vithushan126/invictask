import { Injectable } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';
import { ReplaceFileDto } from './dto/replace-file.dto';
import { cloudinary } from './cloudinary/cloudinary.config';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FileServiceService {
  async uploadFile({ file, folder }: UploadFileDto): Promise<any> {
    console.log('base64', file);
    console.log('folder', folder);

    try {
      const res = await cloudinary.uploader.upload(file, { folder });
      console.log('res', res);

      return res;
    } catch (error) {
      throw new RpcException('Cloudinary upload failed');
    }
  }

  async deleteFile(publicId: string): Promise<any> {
    return await cloudinary.uploader.destroy(publicId);
  }

  async replaceFile({
    oldPublicId,
    file,
    folder,
  }: ReplaceFileDto): Promise<any> {
    // Delete old file first
    await this.deleteFile(oldPublicId);

    // Upload new file
    return await this.uploadFile({ file, folder });
  }
}
