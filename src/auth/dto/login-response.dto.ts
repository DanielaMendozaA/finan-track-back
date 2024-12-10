import { IsEmail, IsString, IsUUID } from "class-validator";

export class LoginResponseDto {

    @IsUUID()
    id: string;

    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    token: string;
}