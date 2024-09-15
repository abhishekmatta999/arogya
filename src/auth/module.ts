import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controller';
import { AppleStrategy, AuthService, GoogleStrategy, JwtStrategy } from './services';
import { UserModuleConstants } from '@app/user/constants';
import { OtpRepository, UserProfileRepository, UserRepository } from '@app/user/repositories';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './services/mailService';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey', // Secret to sign the tokens
      signOptions: { expiresIn: '24h' }, // Token expiration time
    }),],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    GoogleStrategy,
    AppleStrategy,
    { provide: UserModuleConstants.userRepo, useClass: UserRepository },
    { provide: UserModuleConstants.userProfileRepo, useClass: UserProfileRepository },
    { provide: UserModuleConstants.otpRepo, useClass: OtpRepository },
    EmailService
  ],
})
export class AuthModule { }