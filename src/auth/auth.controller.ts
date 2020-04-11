import { Controller, Post, UseGuards, Request, Logger } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService) {}
  
  @UseGuards(LocalAuthGuard)
  @MessagePattern({ role: 'auth', cmd: 'login' })
  async login(data: any) {
    return this.authService.login(data.user)
  }
  
  @Post('auth')
  async loginAPI(@Request() req) {
    return this.authService.login(req.user);
  }

  @MessagePattern({ role: 'auth', cmd: 'check'})
  async loggedIn(data) {
    try {
      const res = this.authService.validateToken(data.jwt);

      return res;
    } catch(e) {
      Logger.log(e);
      return false;
    }
  }
}
