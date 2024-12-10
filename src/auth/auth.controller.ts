import { Controller,  Post, Body, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IAuthService, LoginResponse } from './interfaces/auth-service.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService
  ) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    return this.authService.register(createUserDto)
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.login(loginUserDto)
  }

}
