import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { IAuthService } from './interfaces/auth-service.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginResponse } from './interfaces/auth-service.interface';
import { BadRequestException } from '@nestjs/common';
import { ContactCategoryEnum } from 'src/common/enums/category.enum';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: IAuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'IAuthService',
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<IAuthService>('IAuthService');
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with the correct parameters', async () => {
      const mockCreateUserDto: CreateUserDto = {
        userName: 'testUser',
        email: 'test@email.com',
        password: 'password',
      };

      const mockResponse: Partial<User> = {
        id: '123',
        email: 'test@email.com',
        userName: 'testUser',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(mockResponse);

      const result = await authController.create(mockCreateUserDto);

      expect(authService.register).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockResponse);
    });

    // it('should throw BadRequestException if authService.register fails', async () => {
    //   const mockCreateUserDto: CreateUserDto = {
    //     userName: 'testUser',
    //     email: 'test@email.com',
    //     password: 'password',
    //   };

    //   jest.spyOn(authService, 'register').mockRejectedValue(new BadRequestException('Invalid registration'));

    //   await expect(authController.create(mockCreateUserDto)).rejects.toThrow(BadRequestException);
    // });
  });

  describe('login', () => {
    it('should call authService.login with the correct parameters', async () => {
      const mockLoginUserDto: LoginUserDto = {
        email: 'test@email.com',
        password: 'password',
      };

      const mockResponse: LoginResponse = {
        user: {
          id: '123',
          email: 'test@email.com',
          role: ContactCategoryEnum.REGULAR_CLIENT,
        },
        token: 'mock-jwt-token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);

      const result = await authController.login(mockLoginUserDto);

      expect(authService.login).toHaveBeenCalledWith(mockLoginUserDto);
      expect(result).toEqual(mockResponse);
    });

    it('should throw BadRequestException if authService.login fails', async () => {
      const mockLoginUserDto: LoginUserDto = {
        email: 'test@email.com',
        password: 'wrongpassword',
      };

      jest.spyOn(authService, 'login').mockRejectedValue(new BadRequestException('Invalid credentials'));

      await expect(authController.login(mockLoginUserDto)).rejects.toThrow(BadRequestException);
    });
  });
});
