import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Reflector } from '@nestjs/core';
import { API_KEY, NODE_ENV } from '../../@common/environment-contants';
import { IS_PUBLIC_KEY } from '../../@decorators/public';
export class AuthenticationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    try {
      const { id } = AuthenticationService.verifyEncryptedToken(
        String(authorization),
      );

      request.headers = { id, ...request.headers };
      return id != null;
    } catch (error) {
      return false;
    }
  }
}

export class AdminAuthenticationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    try {
      const { id, isAdmin } = AuthenticationService.verifyEncryptedToken(
        String(authorization),
      );

      request.headers = { id, isAdmin };
      return id != null && isAdmin;
    } catch (error) {
      return false;
    }
  }
}

@Injectable()
export class ApiKeyAuthenticationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      if (NODE_ENV === 'dev') {
        return true;
      }

      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const { apikey } = request.headers;

      if (!apikey) {
        return false;
      }

      const originalText = AuthenticationService.decrypt(apikey);

      return originalText === API_KEY;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
