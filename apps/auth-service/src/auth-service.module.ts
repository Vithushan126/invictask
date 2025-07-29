import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthServiceService } from './auth-service.service';
import { AuthServiceController } from './auth-service.controller';
import { User } from './entity/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', 'apps/auth-service/.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    // ✅ Add this to register the NOTIFICATION_SERVICE microservice client
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATION_SERVICE_HOST, // same as in notification-service main.ts
          port: 4002,
        },
      },
    ]),
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService, JwtStrategy],
})
export class AuthServiceModule {}
