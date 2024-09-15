import { Module } from '@nestjs/common';
import { UserController, UserDashboardController, WorkoutController } from './controllers';
import { UserService, AiService, DashboardService, WorkoutPlanService } from './services';
import { UserModuleConstants } from './constants';
import { UserDietPlanRepository, UserFitnessDataRepository, UserMealTrackingRepository, UserProfileRepository, UserRepository, UserWeightRepository, UserWorkoutPlanRepository } from './repositories';
import { GreetUser } from './commands';
import { AiClientService } from '@app/ai/services/aiClient.service';
import { AiApiService } from '@app/ai/services/ai.service';
import { FileService, GeminiService, HelperService, PromptService } from '@app/ai';
import { AIApiFactory } from '@app/ai/factory/aiClient.factory';
import { MulterModule } from '@nestjs/platform-express';
import { PdfService } from './services/pdf.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Set the destination folder for uploaded files
    }),
  ],
  controllers: [UserController, UserDashboardController, WorkoutController],
  providers: [
    UserService,
    GreetUser,
    { provide: UserModuleConstants.userRepo, useClass: UserRepository },
    { provide: UserModuleConstants.userWeightRepo, useClass: UserWeightRepository },
    { provide: UserModuleConstants.userFitnessDataRepo, useClass: UserFitnessDataRepository },
    { provide: UserModuleConstants.userDietPlanRepo, useClass: UserDietPlanRepository },
    { provide: UserModuleConstants.userProfileRepo, useClass: UserProfileRepository },
    { provide: UserModuleConstants.userMealTrackRepo, useClass: UserMealTrackingRepository },
    { provide: UserModuleConstants.userWorkoutPlanRepo, useClass: UserWorkoutPlanRepository },
    AiService,
    AiClientService,
    AiApiService,
    HelperService,
    GeminiService,
    PromptService,
    FileService,
    AIApiFactory,
    DashboardService,
    PdfService,
    WorkoutPlanService
  ],
})
export class UserModule { }
