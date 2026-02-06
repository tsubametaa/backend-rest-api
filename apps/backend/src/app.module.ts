import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PenulisService, BukuService, AuthService } from './services';
import {
  PenulisController,
  BukuController,
  AuthController,
} from './controllers';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    AppController,
    PenulisController,
    BukuController,
    AuthController,
  ],
  providers: [
    AppService,
    PenulisService,
    BukuService,
    AuthService,
    JwtStrategy,
  ],
})
export class AppModule {}
