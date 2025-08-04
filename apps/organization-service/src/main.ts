import { NestFactory } from '@nestjs/core';
import { OrganizationServiceModule } from './organization-service.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrganizationServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'], // Replace with your RabbitMQ URL
        queue: process.env.ORG_QUEUE || 'org_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((err) => Object.values(err.constraints ?? {}))
          .flat();
        return new RpcException({
          statusCode: 400,
          message: messages,
        });
      },
    }),
  );

  await app.listen();
  console.log(
    'Org microservice is connected to RabbitMQ and listening for messages...',
  );
}
bootstrap();
