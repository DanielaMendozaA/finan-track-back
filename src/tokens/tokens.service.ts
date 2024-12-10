import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Token } from './entities/token.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtPayloadEmail } from 'src/auth/interfaces/jwt-payload-email.interface';
import { TokenEnum } from 'src/enums/token.enum';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async createToken(user: User, type: TokenEnum): Promise<string> {
    const payload: JwtPayloadEmail = { userId: user.id, type};
    const tokenString = await this.getJwtToken(payload);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    const token = this.tokenRepository.create({
      token: tokenString,
      user,
      type,
      expiresAt
    });

    this.tokenRepository.save(token);
    return tokenString;
  }

  async verifyTokenConfirmationEmail(tokenString: string): Promise<boolean> {
    const tokenEntity = await this.tokenRepository.findOne({ where: { token: tokenString }, relations: ['user'] });
    if (!tokenEntity) 
      throw new NotFoundException('Token not found');

    if (tokenEntity.isUsed)
      throw new BadRequestException('Token already verified');

    if (tokenEntity.expiresAt < new Date())
      throw new BadRequestException('Token expired');

    tokenEntity.isUsed = true;
    await this.tokenRepository.save(tokenEntity);
    
    await this.userRepository.update(tokenEntity.user.id, { isVerified: true });
    
    return true;
    
  };

  async verifiTokenChangePassworg (tokenString: string, newPassword: string): Promise<boolean> {
    const tokenEntity = await this.tokenRepository.findOne({ where: { token: tokenString }, relations: ['user'] });
    if (!tokenEntity) 
      throw new NotFoundException('Token not found');

    if (tokenEntity.isUsed)
      throw new BadRequestException('Token already verified');

    if (tokenEntity.expiresAt < new Date())
      throw new BadRequestException('Token expired');

    tokenEntity.isUsed = true;
    await this.tokenRepository.save(tokenEntity);
    
    const salt = bcrypt.genSaltSync();

    const password = bcrypt.hashSync(newPassword, salt);
    await this.userRepository.update(tokenEntity.user.id, { password });
    
    return true;
  }



  private getJwtToken(payload: JwtPayloadEmail): string {
    const token = this.jwtService.sign(payload, { expiresIn: '30m' });
    return token;
  }

}
