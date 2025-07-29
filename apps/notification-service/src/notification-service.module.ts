import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', 'apps/notification-service/.env'],
      isGlobal: true,
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
