import { User } from '@prisma/client';

export class loginDto {
  userId: string;
  email?: string;
  password: string;
  route?: string;
}

export class upsertDto {
  userId: string;
  password: string;
  nickname: string;
  email: string;
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
