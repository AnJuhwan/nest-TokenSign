import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { userResponse } from '../dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'userId' });
  }

  async validate(
    userId: string,
    password: string,
  ): Promise<userResponse | boolean> {
    const user = await this.authService.login({
      userId,
      password,
    });
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요..');
    }
    return user;
  }
}
