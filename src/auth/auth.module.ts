import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TokensModule } from 'src/tokens/tokens.module';
import { MailsenderserviceModule } from 'src/mail-sender/mail-sender-service.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {expiresIn: '60m' }
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    PassportModule,
    ConfigModule,
    TokensModule,
    MailsenderserviceModule
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService
    },
    JwtGuard,
    RolesGuard,
    JwtStrategy
  ],
  exports: [
    'IAuthService'
  ]

})
export class AuthModule { }
