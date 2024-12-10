
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { IAuthService } from './interfaces/auth-service.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokensService } from 'src/tokens/tokens.service';
import { IConfirmationRegisterService } from 'src/mail-sender/interfaces/confirmation-register-service.interface';
import { TokenEnum } from 'src/enums/token.enum';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokensService, 
    @Inject('IConfirmationRegisterService')
    private readonly confirmationRegisterService: IConfirmationRegisterService,
  ) { };

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.validateUser(email, password);
    console.log("este es el user", user);
    

    if (!user || !user.isVerified)
      throw new UnauthorizedException("Invalid Credentials")

    const payload: JwtPayload = { email: user.email, id: user.id }

    const token = this.generateJwtToken(payload)

    return {
      user,
      token
    }
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      select: ['id', 'isVerified']
    });

    if (userExists && userExists.isVerified)
      throw new UnauthorizedException('User already exists');

    if (userExists)
      await this.userRepository.delete(userExists.id);

    const { password, ...userData } = createUserDto;

    const salt = bcrypt.genSaltSync();
    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, salt),
    });
    await this.userRepository.save(user);
    const token = await this.tokenService.createToken(user, TokenEnum.REGISTER);

    const verificationUrl = `http://192.168.89.115:3001/api/v1/tokens/verify-email?token=${token}`;
    await this.confirmationRegisterService.sendVerificationEmail(user.email, user.name, verificationUrl);

    return {
      ...user,
      password: null
    };
  }

  private generateJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload)
  }

  private async validateUser(userEmail: string, userPassword: string): Promise<Partial<User>> {
    const user = await this.userService.findByEmailWithPassword(userEmail);
    console.log("user desde validate user auth", user);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const { password, email, id, isVerified }: Partial<User> = user

    const isValidPassword = this.comparePassword(userPassword, password)
    if (!isValidPassword)
      throw new UnauthorizedException("Invalid credentials")


    return { email, id , isVerified}
  }

  private comparePassword(userPassword: string, password: string): boolean {
    return bcrypt.compareSync(userPassword, password);
  }


}
