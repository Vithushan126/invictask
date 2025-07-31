import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
