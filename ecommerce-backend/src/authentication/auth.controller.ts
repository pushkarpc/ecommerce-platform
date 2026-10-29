import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { type Response } from 'express';
import { AuthUserDto } from './auth-get-user.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async findUserLogin(@Body() email: AuthUserDto) {
    return await this.authService.findUserLogin(email.email);
  }

  @Post('/otpCode')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() body: { email: string; otp: string }, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.verifyOtp(body.email, body.otp);

    response.cookie('set-cookie', result, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: (1 * 60 * 60 * 1000) / 60,
      secure: true,
    });
    return { success: true };
  }
}
