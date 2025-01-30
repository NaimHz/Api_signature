import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthGuard } from '@nestjs/passport';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { RegisterResponseDTO } from './dtos/register-response.dto';
import { Public } from './decorators/public.decorator';
import { User } from 'src/users/users.entity';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(req.user);
  }

  @Post('register')
  @HttpCode(201)
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<User> {
    return await this.authService.register(registerBody);
  }
}
