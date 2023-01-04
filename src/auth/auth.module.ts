import { UsersService } from 'src/users/users.service';
import { PrismaService } from './../common/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JWTRefreshStrategy } from './strategy/refresh-jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_KEY,
      signOptions: {
        expiresIn: `${process.env.ACCESS_TOKEN_EXPIRED}s`,
      },
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    JWTRefreshStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
