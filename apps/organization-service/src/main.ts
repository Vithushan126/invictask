import { NestFactory } from '@nestjs/core';
import { OrganizationServiceModule } from './organization-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrganizationServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
