import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { UserDietPlanRepositoryContract, UserFitnessDataRepositoryContract, UserMealTrackingRepositoryContract, UserProfileRepositoryContract, UserRepositoryContract, UserWeightRepositoryContract } from '../repositories';
import { ActiveEnum, GenderEnum, PeriodEnum, UserModuleConstants } from '../constants';
import { MealTrackDto, ReciepeDto, TrackFitnessDataDto, TrackWeightDto, UserMealTrackDto } from '../dto';
import { AiClientService } from '@app/ai/services/aiClient.service';
import { UserService } from './user';
import { DayEnum, MealTypesEnum } from '@app/enums';
import { start } from 'repl';

@Injectable()
export class DashboardService {
    constructor(
        @Inject(UserModuleConstants.userRepo) private usersRepo: UserRepositoryContract,
        @Inject(UserModuleConstants.userWeightRepo) private userWeightRepo: UserWeightRepositoryContract,
        @Inject(UserModuleConstants.userFitnessDataRepo) private userFitnessDataRepo: UserFitnessDataRepositoryContract,
        @Inject(UserModuleConstants.userDietPlanRepo) private userDietPlanRepo: UserDietPlanRepositoryContract,
        @Inject(UserModuleConstants.userProfileRepo) private userProfileRepo: UserProfileRepositoryContract,
        @Inject(UserModuleConstants.userMealTrackRepo) private userMealTrackRepo: UserMealTrackingRepositoryContract,
        private userService: UserService
    ) { }

    async getFitnessCount(userId: any, params: any) {
        // check if user exists
        // await this.userService.checkIfUserExists(userId);
        const user = await this.usersRepo.firstWhere({ id: userId }, false);
        if (!user) {
            throw new ConflictException("User do not exists")
        }

        const currentUserFitnessData = await this.userFitnessDataRepo.getUserFitnessDataForDashboard(params, userId);

        const fetchedProfile = await this.userProfileRepo.fetchUserProfileForDashboard(userId);
        let distance = 0;
        if (fetchedProfile) {
            const stride = fetchedProfile.gender == 'male' ? 0.413 : 0.415
            distance = ((currentUserFitnessData?.step_count || 0) * (fetchedProfile.height * stride) / 100) / 1000
        }
        return {
            name: user.name,
            fit_sync_status: user.fit_sync_status,
            current: { ...currentUserFitnessData, distance },
            profile: fetchedProfile
        }
    }

    async getNurientsCount (userId: any, params: any) {
        const { end_date = new Date() } = params;
        // const dayId = new Date(start_date).getDay() + 1;
        const dayId = this.userService.getDayForDate(end_date);

        const formattedDate = new Date(end_date).toLocaleString();

        // check if user exists
        await this.userService.checkIfUserExists(userId);

        const dietPlan = await this.userDietPlanRepo.getDietNutirentsCountForDashboard({
            ...params,
            day_id: dayId,
        }, userId);

        const consumedNutirients = await this.userMealTrackRepo.getDietNutirentsCountForDashboard({
            ...params,
            end_date: formattedDate
        }, userId);

        return {
            total_nutrients: dietPlan,
            consumed_nutrients: consumedNutirients
        }
    }

    async getNextMealsToHave(userId) {
        // meal type
        const mealType = this.userService.getMealTypeForTime(new Date());

        // fetch meals
        return this.userDietPlanRepo.fetchNextMealsToEat(mealType, userId);
    }

    
}
