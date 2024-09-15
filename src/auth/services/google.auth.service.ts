import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService, private configService: ConfigService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,  // Set in your environment variables
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.APP_URL}/api/auth/google/callback`,
            scope: [
                'email',
                'profile',
                'https://www.googleapis.com/auth/fitness.activity.read',
                'https://www.googleapis.com/auth/fitness.activity.write',
                'https://www.googleapis.com/auth/fitness.heart_rate.read',
                'https://www.googleapis.com/auth/fitness.heart_rate.write',
                'https://www.googleapis.com/auth/fitness.body.read',
                'https://www.googleapis.com/auth/fitness.body.write'
            ],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { id, name, emails, photos } = profile;
        const user = {
            google_id: id, // Include Google ID
            email: emails[0].value,
            name: name.givenName + ' ' + name.familyName,
            profile_picture_url: photos[0].value,
            access_token: accessToken,   // Include access token
            refresh_token: refreshToken,  // Include refresh token
        };
        const validatedUser = await this.authService.googleLogin(user);
        done(null, validatedUser);
    }
}
