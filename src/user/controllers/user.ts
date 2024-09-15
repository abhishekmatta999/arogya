import { Request, Response, RestController } from '@libs/boat';
import { BadGatewayException, BadRequestException, Body, Controller, Get, Post, Put, Query, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '../services';
import { UserDetailTransformer } from '@app/transformer';
import { UserIdDto, UserWeightDto, TrackWeightDto, TrackFitnessDataDto, ProfileDto, UserMealTrackDto, MealTrackDto, ReciepeDto, EditProfileDto, GetTodayPlanDto, FoodDto, MealIdDto } from '../dto';
import { JwtAuthGuard } from '@app/auth/services';
import Multer, { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller({
  path: 'users',
  version: "1"
})
export class UserController extends RestController {
  constructor(private service: UserService) {
    super();
  }

  @UsePipes(ValidationPipe)
  @Post('/profile')
  async getProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.service.get();
    return res.success(
      await this.transform(user, new UserDetailTransformer(), { req }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Put('/update-weight')
  async updateWeight(
    @Req() req: Request,
    @Body() bodyData: UserWeightDto,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = req.user.userId;
    await this.service.updateWeight(userId, bodyData.weight);
    return res.success({ message: "Weight updated successfully" })
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/weight-tracker')
  async getUserWeights(
    @Req() req: Request,
    @Query() query: TrackWeightDto,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = req.user.userId;
    const result = await this.service.getUserWeights(userId, query);
    return res.success(result);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/sync-google-fit')
  async syncGoogleFit(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    await this.service.syncGoogleFit(req.user.userId);
    return res.success({
      message: "Synced Google fit"
    });
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/get-fit-data')
  async getUserFitnessData(
    @Req() req: Request,
    @Query() query: TrackFitnessDataDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.getUserFitnessData(req.user.userId, query);
    return res.success(result);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/generate-my-diet-plan')
  async generateMyDietPlan(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    await this.service.generateMyDietPlan(req.user.userId);
    return res.success({
      message: 'Plan created successfully'
    });
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/get-my-diet-plan')
  async getMyDietPlan(
    @Query() query: GetTodayPlanDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.service.getMyDietPlan(req.user.userId, query.date);
    return res.success(result);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/save-user-profile')
  async saveUserProfile(
    @Req() req: Request,
    @Body() body: ProfileDto,
    @Res() res: Response,
  ): Promise<any> {
    await this.service.saveProfileData(req.user.userId, body)
    return res.success({
      message: "Profile saved successfully"
    });
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Put('/edit-user-profile')
  async editUserProfile(
    @Req() req: Request,
    @Body() body: EditProfileDto,
    @Res() res: Response,
  ): Promise<any> {
    await this.service.editProfileData(req.user.userId, body)
    return res.success({
      message: "Profile saved successfully"
    });
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/get-user-profile')
  async getuserProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.service.getProfileData(req.user.userId)
    return res.success(result);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/track-user-meal')
  async trackUserMeal(
    @Req() req: Request,
    @Body() body: UserMealTrackDto,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.service.trackUserMeal(req.user.userId, body)
    return res.success(result);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('track-user-meal-list')
  async getTrackUserMeal(
    @Req() req: Request,
    @Query() query: MealTrackDto,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.service.getTrackUserMeal(req.user.userId, query)
    return res.success(result);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('delete-user-meal')
  async deleteUserMeal(
    @Req() req: Request,
    @Query() query: MealIdDto,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.service.deleteUserMeal(req.user.userId, query)
    return res.success({
      message: "Meal removed successfully"
    });
  }

  // @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('generate-reciepe')
  async generateReciepe(
    @Query() query: ReciepeDto,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.service.generateReciepe(query)
    return res.success(result);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Optional: specify a path where to store files
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
    fileFilter: (req, file, callback) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new BadRequestException('Invalid file type. Only JPEG and PNG are allowed.'), false);
      }
      callback(null, true);
    },
  }))
  @Post('get-image-nutrients')
  async getImageRecipieDetails(
    @Res() res: Response,
    @UploadedFile() file: Multer.File,
  ) {
    console.log("file---->>.", file);

    const result = await this.service.getImageRecipieDetails(file)
    return res.success(result);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('export-user-diet')
  async exportUserDiet(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const filePath: any = await this.service.exportUserWeeklyDiet(req?.user?.userId);

    // res.setHeader('Content-Disposition', `attachment; filename=${result?.filePath}`);
    // res.setHeader('Content-Type', 'application/pdf');
    console.log('filePath-->>', filePath);
    

    if (filePath) {
      return res.success(`/files/${filePath}`);
    }

    throw new BadGatewayException("File was not uploaded")
  }

  @UsePipes(ValidationPipe)
  @Post('search-food')
  async searchFood(
    @Query() query: FoodDto,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.service.searchFood(query)
    return res.success(result);
  }
}
