import { UserRoleEnum } from "src/enums/user-role.enum";

export interface JwtPayload {
    id: string;
    email: string;
}