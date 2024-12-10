import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';



@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super();
  }
  private readonly logger = new Logger(JwtGuard.name);

  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    const request = context.switchToHttp().getRequest();
    const clientIp = request.ip || request.connection.remoteAddress;

    if (err || !user) {
      const errorMessage = 'You are not authorized to access this resource';
      this.logger.error(JSON.stringify({ message: errorMessage, clientIp })); 
      throw new UnauthorizedException(errorMessage); 
    }
    this.logger.log(`User authenticated successfully from IP: ${clientIp}`); 
    return user;
  }
}
