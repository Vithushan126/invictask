import { Module } from '@nestjs/common';
import { OrganizationServiceController } from './organization-service.controller';
import { OrganizationServiceService } from './organization-service.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrganizationMember } from './entity/organization-member.entity';
import { Team } from './entity/team.entity';
import { Organization } from './entity/organization.entity';
import { TeamMember } from './entity/team-member.entity';
import { Invitation } from './entity/invitation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', 'apps/organization-service/.env'],
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      entities: [
        Organization,
        Team,
        OrganizationMember,
        TeamMember,
        Invitation,
      ],
      synchronize: true,
    }),

    TypeOrmModule.forFeature([
      Organization,
      Team,
      OrganizationMember,
      TeamMember,
      Invitation,
    ]),

    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.AUTH_QUEUE || 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.USER_QUEUE || 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'FILE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.FILE_QUEUE || 'file_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.NOTIFICATION_QUEUE || 'notification_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [OrganizationServiceController],
  providers: [OrganizationServiceService],
})
export class OrganizationServiceModule {}
