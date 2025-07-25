import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ApiGatewayModule } from './api-gateway.module';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.use(cookieParser());
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true); // allow all origins dynamically
    },
    credentials: true,
  });
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen(Number(process.env.GATEWAY_PORT));
  console.log('API Gateway is listening on port', process.env.GATEWAY_PORT);
}
bootstrap();
