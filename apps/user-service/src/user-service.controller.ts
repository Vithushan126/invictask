import { Controller, Get } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @MessagePattern('user_create')
  create(@Payload() data: any) {
    console.log('data', data);

    return this.userServiceService.create(data.user, data.file);
  }

  @MessagePattern('user_get_all')
  findAll() {
    return this.userServiceService.findAll();
  }

  @MessagePattern('user_get_by_id')
  findOne(@Payload() id: string) {
    return this.userServiceService.findOne(id);
  }

  @MessagePattern('user_update')
  update(@Payload() payload: { id: string; data: UpdateUserDto }) {
    return this.userServiceService.update(payload.id, payload.data);
  }

  @MessagePattern('user_delete')
  remove(@Payload() id: string) {
    return this.userServiceService.remove(id);
  }
}
