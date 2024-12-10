import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { isString, isUUID } from 'class-validator';
import { QueryDto } from 'src/common/dto/query.dto';
import { IForgotPasswordService } from 'src/mail-sender/interfaces/forgot-password-service.interface';
import { TokenEnum } from 'src/enums/token.enum';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('IForgotPasswordService')
    private readonly forgotPasswordService: IForgotPasswordService,
    private readonly tokenService: TokensService
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto)
    return await this.userRepository.save(user)
  }

    async findOneByTerm(term: string): Promise<User> {
    const strategies = [
      {
        condition: () => isUUID(term),
        query: () => this.userRepository.findOne({ where: { id: term } }),
      },
      {
        condition: () => isString(term),
        query: () => this.userRepository.findOne({ where: {email: term}})
        
      },
    ];
  
    const strategy = strategies.find(strategy => strategy.condition());

    if (!strategy) {
      throw new BadRequestException('Invalid search term. Must be a valid UUID or email');
    }
  
    const user = await strategy.query();

    if(!user || !user.isVerified)
      throw new NotFoundException("user not found")
  
    return user;
  }

  async findByEmailWithPassword(email: string): Promise<Partial<User>>{
    const user = await this.userRepository.findOne({
      where: {email},
      select: {password: true, email: true, id: true, isVerified: true}
    });
    
    if(!user)
      throw new NotFoundException("User not found")

    return user
  }

  async findAllUsers( { limit= 10, page= 1}: QueryDto){

    const skip = (page - 1) * limit;
    const take = limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user')

    queryBuilder.orderBy('user.name', 'ASC');
    const [users, total] = await queryBuilder.skip(skip).take(take).getManyAndCount();

    
    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
  };

  }

  async forgotPasswordRequest(email: string) {
    console.log("email del usuario", email);
    const user: User = await this.userRepository.createQueryBuilder("user")
        .addSelect("user.isVerified")
        .where("user.email = :email", { email })
        .getOne();
    
    if (!user) throw new NotFoundException('User not found');

    if (user.isVerified) {
      const token = await this.tokenService.createToken(user, TokenEnum.RESET_PASSWORD);
      const verificationUrl = `https://myapp.com/recover-password?token=${token}`;
      await this.forgotPasswordService.sendForgotPasswordEmail(user.email, user.name, verificationUrl);
    } else {
      throw new NotFoundException('User not verified');

    }

  }
  
  
}
