import { Module } from '@nestjs/common';
import { OrganizationServiceController } from './organization-service.controller';
import { OrganizationServiceService } from './organization-service.service';

@Module({
  imports: [],
  controllers: [OrganizationServiceController],
  providers: [OrganizationServiceService],
})
export class OrganizationServiceModule {}
