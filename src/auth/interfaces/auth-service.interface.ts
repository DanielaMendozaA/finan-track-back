import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { LoginUserDto } from '../dto/login-user.dto';

export interface LoginResponse extends Partial<User> {
    token: string;
    user: Partial<User>; 
  }


export interface IAuthService{
    register(createUserDto: CreateUserDto): Promise<User>;
    login(loginUserDto : LoginUserDto) : Promise<LoginResponse>;

}