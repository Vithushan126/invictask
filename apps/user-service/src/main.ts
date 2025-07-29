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
      transport: Transport.TCP, // You can also use NATS, Redis, gRPC, etc.
      options: {
        port: Number(process.env.PORT) || 4003,
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
  console.log('User microservice is listening on port', process.env.PORT);
}
bootstrap();
