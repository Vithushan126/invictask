import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import * as crypto from 'crypto';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,

    @Inject('NOTIFICATION_SERVICE') // Inject microservice client
    private notificationClient: ClientProxy,
  ) {}

  async register(email: string, password: string) {
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) {
      throw new RpcException('Email already used');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashed });
    await this.userRepo.save(user);
    return { message: 'User registered' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }
    const token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    return { access_token: token };
  }

  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new RpcException('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new RpcException('Old password is incorrect');

    const hashedNew = await bcrypt.hash(newPassword, 10);
    user.password = hashedNew;
    await this.userRepo.save(user);

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new RpcException('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

    user.resetToken = token;
    user.resetTokenExpires = expiry;

    await this.userRepo.save(user);

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Here, you'd normally send the email
    console.log(
      `RESET LINK: http://localhost:3000/reset-password?token=${token}`,
    );

    // 🔔 Send email via notification-service
    this.notificationClient.emit('send_reset_email', {
      to: user.email,
      subject: 'Password Reset Request',
      token: resetLink,
    });

    return { message: 'Reset link has been sent to email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { resetToken: token } });

    if (
      !user ||
      !user.resetTokenExpires ||
      user.resetTokenExpires < new Date()
    ) {
      throw new RpcException('Reset token is invalid or expired');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;

    await this.userRepo.save(user);
    return { message: 'Password reset successful' };
  }
}
