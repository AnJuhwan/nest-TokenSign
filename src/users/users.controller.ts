import {
  Body,
  Controller,
  Post,
  HttpException,
  UseGuards,
  Req,
  Put,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { IChangeNickname, IResetPassword } from './types';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('uesrId')
  async findEmail(
    @Body() body: { userId: string },
  ): Promise<{ success: boolean; message: string } | undefined> {
    const uesrId = await this.usersService.findUserId(body.userId);
    if (!uesrId) {
      return {
        success: true,
        message: '사용가능한 아이디 입니다.',
      };
    }

    return {
      success: false,
      message: '이미 사용중인 아이디 입니다.',
    };
  }

  @Post('nickname')
  async findNickname(
    @Body() body: { nickname: string },
  ): Promise<{ success: boolean; message: string } | undefined> {
    const isNickname = await this.usersService.findNickname(body.nickname);
    if (!isNickname) {
      return {
        success: true,
        message: '사용가능한 닉네임 입니다.',
      };
    }

    return {
      success: false,
      message: '이미 사용중인 닉네임 입니다.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change/nickname')
  async changeNickname(@Body() body: IChangeNickname, @Req() req) {
    const { userId, nickname } = body;
    const isNickname = await this.usersService.findNickname(nickname);
    const validateUser = await this.authService.validateTokenUesr(
      req.user,
      body,
    );

    if (!validateUser) {
      throw new HttpException('회원의 토큰정보가 맞지 않습니다.', 401);
    }
    if (isNickname) {
      return {
        success: false,
        message: '이미 존재하는 닉네임이 있습니다.',
      };
    }
    const nicknameChange = await this.usersService.nicknameChange(
      userId,
      nickname,
    );
    return {
      success: true,
      user: nicknameChange,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change/password')
  async changePassword(@Body() body: IResetPassword, @Req() req) {
    const validateUser = await this.authService.validateTokenUesr(
      req.user,
      body,
    );

    if (!validateUser) {
      throw new HttpException('회원의 토큰정보가 맞지 않습니다.', 401);
    }

    return this.usersService.passwordChange(body.userId, body.password);
  }

  @Get('/check/userId')
  async isFindId(@Query() query: { userId: string }) {
    if (!query.userId) {
      throw new HttpException('잘못된 형식입니다.', 400);
    }

    const isFindId = await this.usersService.findUserId(query.userId);

    if (!isFindId) {
      return {
        success: false,
        message: '가입된 아이디 정보가 없습니다.',
      };
    }
    return {
      success: true,
      id: isFindId.id,
      userId: isFindId.userId,
    };
  }

  @Put('/reset/password')
  async resetPassword(@Body() body: IResetPassword) {
    return this.usersService.resetPassword(body);
  }
}
