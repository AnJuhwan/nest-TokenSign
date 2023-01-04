import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { PrismaService } from './../common/prisma/prisma.service';
import { IResetPassword } from './types';

export interface IUser {
  id: number;
  userId: string;
  password: string;
  email: string;
  nickname: string;
  deleted_yn: number;
  modified_at: Date;
  created_at: Date;
  report_number: number;
  route: string;
}

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async findUserId(userId: string): Promise<IUser | null> {
    const findUser = await this.prismaService.user.findUnique({
      where: { userId: userId },
    });

    if (findUser) {
      return findUser;
    }

    return null;
  }

  async findNickname(nickname: string): Promise<IUser | null> {
    const isNickname = await this.prismaService.user.findUnique({
      where: { nickname: nickname },
    });

    if (isNickname) {
      return isNickname;
    }
    return null;
  }

  async validationUser(userId: string, password: string): Promise<boolean> {
    const findUserData = await this.findUserId(userId);
    const userPassword = findUserData?.password;

    if (findUserData) {
      const isUserId = await this.findUserId(userId);
      const isSuccessPassword = await bcrypt.compare(password, userPassword);

      if (isUserId && isSuccessPassword) {
        return true;
      }
    }
    return false;
  }

  async nicknameChange(userId: string, nickname: string) {
    const nicknameUpdate = await this.prismaService.user.update({
      where: {
        userId,
      },
      data: {
        nickname,
      },
    });
    return nicknameUpdate;
  }

  async passwordChange(userId: string, password: string) {
    const hashPassword = await bcrypt.hash(
      password,
      Number(this.configService.get('HASH')),
    );

    const passwordUpdate = await this.prismaService.user.update({
      where: {
        userId,
      },
      data: {
        password: hashPassword,
      },
    });

    if (!passwordUpdate) {
      throw new HttpException('비밀번호 변경에 실패하였습니다.', 401);
    }

    return {
      success: true,
      uesr: passwordUpdate,
    };
  }

  async resetPassword(data: IResetPassword) {
    const { userId, id, password } = data;

    const hashPassword = await bcrypt.hash(
      password,
      Number(this.configService.get('HASH')),
    );

    try {
      const updatePassword = await this.prismaService.user.update({
        where: {
          uniqueId: {
            id,
            userId,
          },
        },
        data: {
          password: hashPassword,
        },
      });
      return {
        success: true,
        uesr: updatePassword,
      };
    } catch (error) {
      throw new HttpException('비밀번호 변경에 실패하였습니다.', 401);
    }
  }
}
