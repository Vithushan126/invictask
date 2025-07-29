import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationServiceModule } from './notification-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.NOTIFICATION_SERVICE_HOST,
        port: Number(process.env.NOTIFICATION_PORT) || 4002,
      },
    },
  );
  await app.listen();
  console.log(
    'Notification service is listening on port',
    process.env.NOTIFICATION_PORT,
  );
}
bootstrap();
