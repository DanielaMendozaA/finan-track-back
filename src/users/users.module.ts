import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TokensModule } from 'src/tokens/tokens.module';
import { MailsenderserviceModule } from 'src/mail-sender/mail-sender-service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => TokensModule),
    MailsenderserviceModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    UsersService,
    TypeOrmModule
  ]
})
export class UsersModule {}
