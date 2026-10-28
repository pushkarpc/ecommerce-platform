import { Body, Controller, Post } from '@nestjs/common';
import { AuthUserDto } from './auth-get-user.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  findUserLogin(@Body() email: AuthUserDto) {
    return this.authService.findUserLogin(email.email);
  }
}
