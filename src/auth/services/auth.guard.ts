import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Add custom authentication logic here if needed
        // Call the default `canActivate` method to check for JWT token
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        // const response = context.switchToHttp().getResponse();

        // Custom error handling or additional user checks can be added here
        if (err || !user) {
            throw err || new UnauthorizedException('Unauthorized');
        }

        // // Add a custom header in the response
        // response.setHeader('Authorization', token);

        return user;
    }
}
