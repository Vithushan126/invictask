import { Controller, Get } from '@nestjs/common';
import { OrganizationServiceService } from './organization-service.service';

@Controller()
export class OrganizationServiceController {
  constructor(private readonly organizationServiceService: OrganizationServiceService) {}

  @Get()
  getHello(): string {
    return this.organizationServiceService.getHello();
  }
}
