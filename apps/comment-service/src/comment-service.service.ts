import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
