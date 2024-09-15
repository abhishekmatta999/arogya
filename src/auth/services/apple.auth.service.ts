import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-apple';
import { AuthService } from './auth';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
    constructor(private authService: AuthService, private configService: ConfigService) {
        super({
            clientID: process.env.APPLE_CLIENT_ID,  // Apple Client ID
            teamID: process.env.APPLE_TEAM_ID,
            keyID: process.env.APPLE_KEY_ID,
            key: process.env.APPLE_PRIVATE_KEY,  // Private key path
            callbackURL: `${process.env.APP_URL}/auth/apple/callback`,
            scope: ['email', 'name'],
        });
    }

    // async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    //     const { id, email, name } = profile;
    //     const user = {
    //         appleId: id, // Include Apple ID
    //         email,
    //         firstName: name.givenName,
    //         lastName: name.familyName,
    //         picture: '', // Apple profile might not include a picture
    //         accessToken,   // Include access token
    //         refreshToken,  // Include refresh token
    //     };
    //     const validatedUser = await this.authService.validateUser(user);
    //     done(null, validatedUser);
    // }
}
