import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
// import { FileService } from './file.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { DeleteFileDto } from './dto/delete-file.dto';
import { FileServiceService } from './file-service.service';
import { ReplaceFileDto } from './dto/replace-file.dto';

@Controller()
export class FileServiceController {
  constructor(private readonly fileServiceService: FileServiceService) {}

  @MessagePattern('upload_file')
  async uploadFile(data: UploadFileDto) {
    console.log('dataaaaaaaaaa', data);

    return this.fileServiceService.uploadFile(data);
  }

  @MessagePattern('delete_file')
  async deleteFile(data: DeleteFileDto) {
    return this.fileServiceService.deleteFile(data.publicId);
  }

  @MessagePattern('replace_file')
  async replaceFile(data: ReplaceFileDto) {
    return this.fileServiceService.replaceFile(data);
  }
}
