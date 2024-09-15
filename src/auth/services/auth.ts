import { OAuthProvider, UserModuleConstants } from '@app/user/constants';
import { OtpRepositoryContract, UserProfileRepositoryContract, UserRepositoryContract } from '@app/user/repositories';
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GoogleSignupDto, SignUpDto } from '../dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './mailService';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UserModuleConstants.userRepo)
        private userRepository: UserRepositoryContract,
        @Inject(UserModuleConstants.userProfileRepo)
        private userProfileRepository: UserProfileRepositoryContract,
        @Inject(UserModuleConstants.otpRepo)
        private otpRepository: OtpRepositoryContract,
        private jwtService: JwtService,
        private mailService: EmailService
    ) { }

    // Service function for form-based signup
    async formSignup(signupDto: SignUpDto) {
        const { email, password, otp } = signupDto;

        // 1. Check if user already exists
        const existingUser = await this.userRepository.firstWhere({ email }, false);
        if (existingUser) {
            throw new ConflictException('User with this email already exists.');
        }

        const otpVerified = await this.verifyOtp({ email, otp });
        await this.otpRepository.updateWhere({ email, otp }, { verified: otpVerified })

        // 2. Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // 3. Create a new user
        const user = await this.userRepository.create({
            email,
            password_hash: passwordHash,
            oauth_provider: OAuthProvider.FORM,
            otp_verified: otpVerified,
        });
        const jwt = await this.generateJwt(user);

        // 4. Return the user id and email
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profile_picture_url: user.profile_picture_url,
                profile_saved: user.profile_saved,
                fit_sync_status: user.fit_sync_status
            },
            access_token: jwt.access_token,
        };
    }

    async verifyOtp(data: any) {
        const { email, otp } = data;
        const userOtp = await this.otpRepository.firstWhere({ email, otp }, false);
        if (userOtp.verified) {
            throw new ConflictException('Otp already verified');
        }
        return userOtp.otp == otp;
    }

    async generateUserOtp(email: string) {
        // 1. Check if user already exists
        const existingUser = await this.userRepository.firstWhere({ email }, false);
        if (existingUser) {
            throw new ConflictException('User with this email already exists.');
        }
        const otp = this.generateOTP(6);
        await this.otpRepository.create({ email: email, otp });
        // sendOtpMail
        await this.mailService.sendOtpMail({
            email,
            otp,
            message: "Please verify otp to sign up on Aarogya AI",
            subject: "Verify OTP"
        });
    }

    generateOTP(length = 6) {
        const digits = '1234567891';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return parseInt(otp);
    }

    // Login Function
    async login(loginDto: SignUpDto): Promise<any> {
        const { email, password } = loginDto;

        // 1. Check if the user exists
        const user = await this.userRepository.firstWhere({ email }, false);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // 2. Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // const userProfile = await this.userProfileRepository.firstWhere({ user_id: user.id }, false)
        // 3. Generate JWT token for the user
        const jwt = await this.generateJwt(user);


        // 4. Return the user and JWT token
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profile_picture_url: user.profile_picture_url,
                profile_saved: user.profile_saved,
                fit_sync_status: user.fit_sync_status
            },
            access_token: jwt.access_token,
        };
    }

    async googleLogin(payload: GoogleSignupDto): Promise<any> {
        // Here you would save the user to the database or check if they already exist
        const { email } = payload;
        if (!email) {
            throw new BadRequestException("Email is required")
        }
        // Check if the user exists in the database
        let user = await this.userRepository.firstWhere({ email }, false);
        if (user && user.oauth_provider == OAuthProvider.FORM) {
            await this.userRepository.updateWhere({
                email
            }, {
                access_token: payload.access_token,
                refresh_token: payload.refresh_token,
                updated_at: new Date(),
            })
        } else {
            if (!user) {
                // If not, create a new user
                user = await this.userRepository.create({
                    ...payload,
                    oauth_provider: OAuthProvider.GOOGLE
                });
            } else {
                await this.userRepository.updateWhere({
                    email
                }, {
                    ...payload,
                    updated_at: new Date(),
                    oauth_provider: OAuthProvider.GOOGLE
                })
            }
        }

        const jwt = await this.generateJwt(user);
        return {
            user,
            ...jwt,
        };
    }

    // Generate JWT Token
    async generateJwt(user: any) {
        const payload = { email: user.email, id: user.id }; // sub is a common JWT claim for user ID
        return {
            access_token: this.jwtService.sign(payload), // Sign the payload to create a JWT
        };
    }

    // Optionally, validate JWT token if needed
    async validateToken(token: string) {
        return this.jwtService.verify(token);
    }


    async getUserList(): Promise<any> {
        return this.userRepository.getWhere({}, false);
    }

    async changePassword(body: any): Promise<any> {
        const { email, otp, password } = body;
        const user = await this.userRepository.firstWhere({ email }, false);
        if (!user) {
            throw new NotFoundException('User with this email do not exists.');
        }
        const otpDb = await this.otpRepository.firstWhere({ email, otp, verified: false }, false);
        if (!otpDb) {
            throw new NotFoundException('Otp not valid');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        await this.userRepository.updateWhere({ id: user.id }, { password_hash: passwordHash })
        await this.otpRepository.updateWhere({ email, otp }, { verified: true });
    }

    async forgotPassword(body: any): Promise<any> {
        const { email } = body;
        const otp = this.generateOTP(6);
        await this.otpRepository.create({ email, otp });
        await this.mailService.sendOtpMail({
            email,
            otp,
            message: "Please verify otp to change your password on Aarogya AI",
            subject: "Change Password"
        });
    }
}