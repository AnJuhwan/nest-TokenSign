import { User } from '@prisma/client';

export class loginDto {
  userId: string;
  email?: string;
  password: string;
  route?: string;
}

export class authDto extends loginDto {
  nickname: string;
}

export class userResponse {
  data: {
    user: User;
    token: {
      refreshToken: string;
      accessToken: string;
    };
  };
}
