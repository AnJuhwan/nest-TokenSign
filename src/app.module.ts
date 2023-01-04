import { PrismaService } from './common/prisma/prisma.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { MailController } from './mail/mail.controller';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    MailModule,
    JwtModule,
  ],
  controllers: [AppController, UsersController, MailController],
  providers: [
    AppService,
    UsersService,
    PrismaService,
    MailService,
    AuthService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // middleware는 consumer 에다가 연결함 (forRoutes 특정 controller , path 에만 middleware적용만도 가능)
  }
}
