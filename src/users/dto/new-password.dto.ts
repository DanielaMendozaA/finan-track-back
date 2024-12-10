import { MinLength, MaxLength, Matches } from "class-validator";


export class NewPasswordDto {
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password - The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}


