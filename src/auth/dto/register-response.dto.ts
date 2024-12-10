import { IsBoolean, IsEmail, IsOptional, IsString, IsStrongPassword, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterResponseDto {

    @IsUUID()
    id: string
    
    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(1)
    userName: string;
    
}