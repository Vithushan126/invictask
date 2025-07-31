import { Module } from '@nestjs/common';
import { CommentServiceController } from './comment-service.controller';
import { CommentServiceService } from './comment-service.service';

@Module({
  imports: [],
  controllers: [CommentServiceController],
  providers: [CommentServiceService],
})
export class CommentServiceModule {}
