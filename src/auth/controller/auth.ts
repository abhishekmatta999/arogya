import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, JwtAuthGuard } from '../services';
import { RestController, Response } from '@libs/boat';
import { ChangePasswordDto, GenerateOtpDto, GoogleSignupDto, SignUpDto } from '../dto';

@Controller({
  path: 'auth',
  version: "1"
})
export class AuthController extends RestController {
  constructor(private service: AuthService) {
    super();
  }

  @Post('signup')
  async formSignup(
    @Body() formSignupDto: SignUpDto,
    @Res() res: Response
  ) {
    const result = await this.service.formSignup(formSignupDto);
    return res.success(result)
  }

  @Post('generate-otp')
  async generateOtp(
    @Body() bodyData: GenerateOtpDto,
    @Res() res: Response
  ) {
    await this.service.generateUserOtp(bodyData.email);
    return res.success({
      message: "OTP generated"
    })
  }

  @Post('login')
  async login(
    @Body() loginDto: SignUpDto,
    @Res() res: Response
  ) {
    const result = await this.service.login(loginDto);
    return res.success(result)
  }

  @Post('login/google')
  async googleLogin(
    @Body() googleSignupDto: GoogleSignupDto,
    @Res() res: Response
  ) {
    const result = await this.service.googleLogin(googleSignupDto);
    return res.success(result);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: GenerateOtpDto,
    @Res() res: Response
  ) {
    await this.service.forgotPassword(body);
    return res.success({
      message: "Otp Sent"
    });
  }

  @Post('change-password')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Res() res: Response
  ) {
    await this.service.changePassword(body);
    return res.success({
      message: "Password changed successfully"
    });
  }

  // Google Login
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log("Request google")
    // This will trigger Google's OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any) {
    console.log("Redirect successful")
    return {
      message: 'Google login successful',
      user: req.user,
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('logout')
  // async logout(@Req() req: any, @Res() res: any) {
  //   console.log("Logout")
  //   const user = req.user
  // }
}
