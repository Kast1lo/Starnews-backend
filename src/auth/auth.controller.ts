import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto:RegisterRequest){
    return this.authService.register(dto)
  }
  @Post('login')
  async login(@Body() dto: LoginRequest){
    return this.authService.login(dto)
  }
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout() {
  return { message: 'Выход выполнен' };
  }
}
