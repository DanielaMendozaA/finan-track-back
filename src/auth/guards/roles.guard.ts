import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../../decorators/roles.decorator';
import { UserRoleEnum } from 'src/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) { }
  private readonly logger = new Logger(RolesGuard.name)
  
  canActivate(context: ExecutionContext): boolean {
    const roles: UserRoleEnum[] = this.reflector.get<UserRoleEnum[]>(ROLES_KEY, context.getHandler());

    if(!roles)
      return true
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(user);

    const validRole = roles.includes(user.role)

    if(!validRole){
      this.logger.error('User does not have the necessary role');
      throw new ForbiddenException("You don't have required permissions to this path")
    }

    return true;
  }
}
