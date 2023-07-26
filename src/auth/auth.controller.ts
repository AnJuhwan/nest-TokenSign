import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { authDto, loginDto, upsertDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshAuthGuard } from './guard/refresh-jwt.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private uesrsService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() body: authDto) {
    return await this.authService.signup(body);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: loginDto) {
    return await this.authService.login(body);
  }

  @UseGuards(RefreshAuthGuard)
  @Get('accessToken')
  async getAccessToken(@Req() req) {
    const { userId, id, email } = req.user;
    return await this.authService.getAccessToken({ userId, id, email });
  }

  @Patch('upsert')
  async upsertAuth(@Body() body: upsertDto) {
    return await this.authService.upsertAuth(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async Test(@Req() req) {
    return req.user;
  }

  @UseGuards(RefreshAuthGuard)
  @Get('test2')
  async Test2(@Req() req) {
    return req.user;
  }
}
