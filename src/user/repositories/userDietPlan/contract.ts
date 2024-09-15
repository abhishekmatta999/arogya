import { UserDietPlanModel } from '@app/user/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface UserDietPlanRepositoryContract
    extends RepositoryContract<UserDietPlanModel> {
    getMyDietPlan(userId: number, day: number): Promise<any>;

    getDietNutirentsCountForDashboard(params: any, userId: any);

    fetchNextMealsToEat (mealType: string, userId: any);

    groupByMealTypePlan(userId: number, dayId: number): Promise<any>;
}
