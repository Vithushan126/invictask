import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationServiceController } from './organization-service.controller';
import { OrganizationServiceService } from './organization-service.service';

describe('OrganizationServiceController', () => {
  let organizationServiceController: OrganizationServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationServiceController],
      providers: [OrganizationServiceService],
    }).compile();

    organizationServiceController = app.get<OrganizationServiceController>(OrganizationServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(organizationServiceController.getHello()).toBe('Hello World!');
    });
  });
});
