import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
    email: string;
    id: string;  // Usually the user ID
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extract JWT from the Authorization header
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'yourSecretKey',  // Secret key used to sign the token
        });
    }

    async validate(payload: JwtPayload) {
        // Validate the payload and return the user object
        return { userId: payload.id, email: payload.email };
    }
}
