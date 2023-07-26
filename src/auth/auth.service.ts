import { PrismaService } from './../common/prisma/prisma.service';
import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { authDto, loginDto, upsertDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';

interface SecretAccessTokenType {
  userId: string;
  email: string;
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async upsertAuth(body: upsertDto) {
    const { userId, password, nickname, email } = body;

    // const isUser = await this.userService.findNickname(nickname);

    // if (isUser) {
    //   return await this.userService.nicknameChange(userId, nickname);
    // }

    // return await this.signup({
    //   userId,
    //   nickname,
    //   email,
    //   password,
    // });

    // const user = this.prismaService.user.upsert({
    //   where: { userId },
    //   create: {
    //     userId,
    //     email,
    //     nickname,
    //     password,
    //   },
    //   update: {
    //     nickname,
    //   },
    // });

    // return user;

    try {
      await this.prismaService.$queryRaw<upsertDto>`
        INSERT INTO User (userId, nickname, password, email)
        values (${userId}, ${nickname}, ${password} , ${email})
        ON DUPLICATE KEY UPDATE
        nickname = ${nickname}
      `;

      return {
        success: true,
      };
    } catch (error: any) {
      console.log(error);
      throw new HttpException('저장에 실패하였습니다.', 400);
    }
  }

  async signup(authDto: authDto): Promise<HttpException | User> {
    const { userId, email, password, nickname, route } = authDto;

    const isUserId = await this.userService.findUserId(userId);

    const isNickname = await this.userService.findNickname(nickname);

    if (isUserId) {
      throw new HttpException('이미 사용중인 아이디 입니다.', 401);
    }

    if (isNickname) {
      throw new HttpException('이미 사용중인 닉네임 입니다.', 401);
    }

    const hashPassword = await bcrypt.hash(
      password,
      Number(this.configService.get('HASH')),
    );

    const saveUser = await this.prismaService.user.create({
      data: {
        userId: userId,
        email: email,
        password: hashPassword,
        nickname: nickname,
        route: route,
      },
    });

    return saveUser;
  }

  async login(loginForm: loginDto) {
    const { userId, password } = loginForm;
    const validate = await this.userService.validationUser(userId, password);

    const user = await this.prismaService.user.findMany({
      where: { userId: userId },
    });

    if (user.length === 0) {
      throw new HttpException('이메일 또는 비밀번호를 확인해주세요.', 401);
    }

    const jwtPayload = {
      userId: user[0].userId,
      email: user[0].email,
      id: user[0].id,
      route: user[0].route,
    };

    if (validate) {
      const refreshToken = this.jwtService.sign(jwtPayload, {
        secret:
          process.env.REFRESH_TOKEN_KEY ||
          this.configService.get('REFRESH_TOKEN_KEY'),
      });

      const accessToken = this.jwtService.sign(jwtPayload);

      return {
        data: {
          user: user[0],
          token: {
            refreshToken: refreshToken,
            accessToken: accessToken,
          },
        },
      };
    }
    return false;
  }

  async getAccessToken(tokenType: SecretAccessTokenType) {
    const accessToken = this.jwtService.sign(tokenType);
    return {
      token: accessToken,
    };
  }

  async validateUser(userId: string, password: string) {
    return this.userService.validationUser(userId, password);
  }

  async validateTokenUesr(
    encodingToken: SecretAccessTokenType,
    bodyData: { userId: string; nickname?: string },
  ) {
    const { userId } = encodingToken;
    const { userId: bodyuserId } = bodyData;

    if (userId === bodyuserId) {
      return encodingToken;
    }

    return false;
  }
}
