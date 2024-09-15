import { IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class SignUpDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsNumber()
    otp: number;
}

export class GenerateOtpDto {
    @IsEmail()
    email: string;
}

export class ChangePasswordDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsNumber()
    otp: number;
}

export class GoogleSignupDto {
    @IsString()
    email: string;

    @IsString()
    google_id: string;

    @IsString()
    name: string;

    @IsString()
    profile_picture_url: string;

    @IsString()
    access_token: string;

    @IsOptional()
    @IsString()
    refresh_token: string;
}