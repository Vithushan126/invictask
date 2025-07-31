import { Controller, Get } from '@nestjs/common';
import { CommentServiceService } from './comment-service.service';

@Controller()
export class CommentServiceController {
  constructor(private readonly commentServiceService: CommentServiceService) {}

  @Get()
  getHello(): string {
    return this.commentServiceService.getHello();
  }
}
