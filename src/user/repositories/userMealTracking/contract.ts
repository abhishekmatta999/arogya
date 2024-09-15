import { MealTrackDto } from '@app/user/dto';
import { UserMealTrackingModel } from '@app/user/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface UserMealTrackingRepositoryContract
    extends RepositoryContract<UserMealTrackingModel> {
    getTrackUserMeal(userId: number, query: MealTrackDto): Promise<any>;

    getDietNutirentsCountForDashboard(params: any, userId: any);
}