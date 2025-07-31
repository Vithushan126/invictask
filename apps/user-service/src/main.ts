import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.RMQ, // You can also use NATS, Redis, gRPC, etc.
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'], // Replace with your RabbitMQ URL
        queue: process.env.USER_QUEUE || 'user_queue',
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
    'User microservice is connected to RabbitMQ and listening for messages...',
  );
}
bootstrap();
