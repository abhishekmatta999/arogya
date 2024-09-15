import { UserDietPlanModel } from '@app/user/models';
import { Injectable } from '@nestjs/common';
import { UserDietPlanRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class UserDietPlanRepository
  extends DatabaseRepository<UserDietPlanModel>
  implements UserDietPlanRepositoryContract {
  @InjectModel(UserDietPlanModel)
  model: UserDietPlanModel;

  async getMyDietPlan(userId: number, day?: number): Promise<any> {
    const query = UserDietPlanModel.query().select(
      'days.name',
      UserDietPlanModel.raw(`
        JSON_AGG(
          json_build_object(
            'meal_type', user_diet_plan.meal_type,
            'items', json_build_object(
              'name', user_diet_plan.meal_name,
              'type', user_diet_plan.meal_eat_type,
              'quantity', user_diet_plan.meal_quantity,
              'calories', user_diet_plan.calories,
              'protein', user_diet_plan.protein,
              'fiber', user_diet_plan.fiber,
              'fat', user_diet_plan.fat
            )
          ) 
        ) as meals
      `)
    )
      .where("user_id", userId)
      .leftJoin('days', 'days.id', 'user_diet_plan.day_id')
      .groupBy(
        'day_id',
        'days.name'
      )
      .orderBy('day_id', 'ASC');

    if (day) {
      query.where('day_id', day)
    }

    return query;
  }


  getDietNutirentsCountForDashboard(params: any, userId: any) {
    const { day_id } = params;

    return UserDietPlanModel.query()
      .select(UserDietPlanModel.raw(`
        SUM(CAST(carbs AS REAL)) AS total_carbs,
        SUM(CAST(fat AS REAL)) AS total_fat,
        SUM(CAST(protein AS REAL)) AS total_protein,
        SUM(CAST(calories AS REAL)) AS total_calories,
        SUM(CAST(fiber AS REAL)) AS total_fiber
      `))
      .where({ user_id: userId, day_id: day_id })
      .first();
  }

  fetchNextMealsToEat(mealType: string, userId: any) {
    return UserDietPlanModel.query()
      .select('user_diet_plan.*')
      // .join('user_meal_tracking', 'user_diet_plan.user_id', 'user_meal_tracking.user_id')
      .where({
        'user_diet_plan.user_id': userId,
        'user_diet_plan.meal_type': mealType
      })
    // .andWhere('user_meal_tracking.')
  }

  async groupByMealTypePlan(userId: number, dayId: number): Promise<any> {
    return UserDietPlanModel.query()
      .select(
        'meal_type',
        UserDietPlanModel.raw(`
          SUM(CAST(carbs AS REAL)) AS total_carbs,
          SUM(CAST(fat AS REAL)) AS total_fat,
          SUM(CAST(protein AS REAL)) AS total_protein,
          SUM(CAST(calories AS REAL)) AS total_calories,
          SUM(CAST(fiber AS REAL)) AS total_fiber
        `)
      )
      .where({ user_id: userId, day_id: dayId })
      .groupBy('meal_type')
  }
}
