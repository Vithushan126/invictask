import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationServiceService } from './notification-service.service';

@Controller()
export class NotificationController {
  constructor(private notificationService: NotificationServiceService) {}

  @MessagePattern('send_reset_email')
  async sendResetEmail(data: { to: string; subject: string; token: string }) {
    return this.notificationService.handleSendResetEmail(data);
  }
}
