import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { AuthService } from './auth.service';
import { IAuthService } from './interfaces/auth-service.interface';
import { IUserService } from 'src/users/interfaces/user-service.interface';
import { UsersService } from 'src/users/users.service';
import { ContactCategoryEnum } from 'src/common/enums/category.enum';
import { User } from 'src/users/entities/user.entity';
import { ConflictException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { DbErrorsHandler } from 'src/common/errors/handle-errors/handle-database-error.service';

describe('AuthService', () => {
  let service: IAuthService;
  let userService: IUserService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let mockDbErrorsHandler: DbErrorsHandler;

  const mockUser = {
    id: 'fe3570c6-adc8-4aa5-b3c1-c8d184af5260',
    email: 'test@email.com',
    role: 'regular_client',
    password: bcrypt.hashSync('1234password', bcrypt.genSaltSync()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'IAuthService',
          useClass: AuthService
        },
        {
          provide: 'IUserService',
          useClass: UsersService
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          }
        },
        JwtService
      ],
    }).compile();

    service = module.get<IAuthService>('IAuthService');
    userService = module.get<IUserService>('IUserService');
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    mockDbErrorsHandler = new DbErrorsHandler();

    jest.spyOn(userService, 'findByEmailWithPassword').mockResolvedValue(mockUser as User);
    jest.spyOn(mockDbErrorsHandler, 'handleDatabaseError').mockReturnValue(
      new HttpException('Duplicate key error', HttpStatus.CONFLICT),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('Should return a user payload and token if credentials are valid',
      async () => {
        const mockLoginUserDto = {
          email: 'test@email.com',
          password: '1234password'
        };
        const mockJwtPayload = {
          email: mockUser.email,
          id: mockUser.id,
          role: mockUser.role
        };
        const mockToken = 'jwt-token';

        jest.spyOn(userService, 'findByEmailWithPassword').mockResolvedValue(mockUser as User);
        jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

        const result = await service.login(mockLoginUserDto);
        const expectedUser = { ...mockUser };
        delete expectedUser.password;


        expect(userService.findByEmailWithPassword).toHaveBeenCalledWith(mockLoginUserDto.email);
        expect(jwtService.sign).toHaveBeenCalledWith(mockJwtPayload);
        expect(result).toEqual({
          user: expectedUser,
          token: mockToken,
        });

      });

    it('Should throw UnauthorizedException if credentials are invalid', async () => {
      const mockLoginUserDto = {
        email: 'invalid@email.com',
        password: 'wrongPassword'
      };

      jest.spyOn(userService, 'findByEmailWithPassword').mockResolvedValue(undefined);

      await expect(service.login(mockLoginUserDto))
        .rejects
        .toThrow(UnauthorizedException);

      expect(userService.findByEmailWithPassword).toHaveBeenCalledWith(mockLoginUserDto.email)
    });

    it('Should throw UnauthorizedException if the password is incorrect', async () => {
      const mockLoginUserDto = {
        email: 'test@email.com',
        password: 'incorrectPassword'
      };

      jest.spyOn(userService, 'findByEmailWithPassword').mockResolvedValue(mockUser as User);

      await expect(service.login(mockLoginUserDto))
        .rejects
        .toThrow(UnauthorizedException);

      expect(userService.findByEmailWithPassword).toHaveBeenCalledWith(mockLoginUserDto.email);
    });

  });



  describe('register', () => {
    it('Should create a new user and return the user', () => {
      async () => {
        const mockCreateUserDto = {
          userName: 'testUser',
          email: 'test@email.com',
          password: 'wrongPassword'
        };

        const mockHashedPassword = 'hashedPassword123';
        jest.spyOn(userService, 'createUser').mockResolvedValue({
          id: 'userId123',
          userName: mockCreateUserDto.userName,
          email: mockCreateUserDto.email,
          password: mockHashedPassword
        } as User);

        const result = await service.register(mockCreateUserDto);

        expect(userService.createUser).toHaveBeenCalledWith({
          ...mockCreateUserDto,
          password: expect.any(String),
        });

        expect(result).toEqual({
          id: 'userId123',
          userName: mockCreateUserDto.userName,
          email: mockCreateUserDto.email,
        });
      };
    });

    // it('should throw ConflictException if the email or username already exists', async () => {
    //   const mockCreateUserDto = {
    //     userName: 'testUser',
    //     email: 'test@email.com',
    //     password: 'password',
    //   };

    //   jest.spyOn(mockDbErrorsHandler, 'handleDatabaseError').mockReturnValue(
    //     new ConflictException('Duplicate key error: email already exists'),
    //   );

    //   jest.spyOn(userRepository, 'create').mockReturnValue(mockCreateUserDto as User);
    //   jest.spyOn(userRepository, 'save').mockRejectedValue({
    //     code: '23505',
    //     detail: 'Duplicate key error: "email"',
    //   });

    //   await expect(service.register(mockCreateUserDto)).rejects.toThrow(ConflictException);
    // });


  });



});
