import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @MaxLength(50)
  @IsNotEmpty()
  @Matches(
    /(?:(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*)/,
    { message: 'password - The password must have at least one upper case letter, one lower case letter, and one number' }
  )
  password: string;

}

