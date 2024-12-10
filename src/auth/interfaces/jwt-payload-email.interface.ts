import { TokenEnum } from "src/enums/token.enum";

export interface JwtPayloadEmail {
    userId: string;
    type: TokenEnum;
}