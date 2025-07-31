import { NestFactory } from '@nestjs/core';
import { CommentServiceModule } from './comment-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CommentServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
