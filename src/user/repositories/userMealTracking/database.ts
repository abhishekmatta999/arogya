import { UserMealTrackingModel } from '@app/user/models';
import { Injectable } from '@nestjs/common';
import { UserMealTrackingRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';
import { MealTrackDto } from '@app/user/dto';

@Injectable()
export class UserMealTrackingRepository
    extends DatabaseRepository<UserMealTrackingModel>
    implements UserMealTrackingRepositoryContract {
    @InjectModel(UserMealTrackingModel)
    model: UserMealTrackingModel;

    async getTrackUserMeal(userId: number, query: MealTrackDto): Promise<any> {
        const { date } = query;
        const start_date = date ? new Date(date).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0);
        const end_date = date ? new Date(date).setHours(23, 59, 59, 999) : new Date().setHours(23, 59, 59, 999);

        return UserMealTrackingModel.query().select(
            'id',
            'meal_name',
            'meal_quantity',
            'calories',
            'protein',
            'fiber',
            'fat',
            'meal_time',
            'meal_type',
            'meal_unit'
        )
            .where('user_id', userId)
            .andWhereBetween('meal_time', [new Date(start_date), new Date(end_date)])
            .orderBy('meal_time', 'DESC');
    }

    async getDietNutirentsCountForDashboard(params: any, userId: any) {
        const { end_date } = params;
        return UserMealTrackingModel.query()
            .select(UserMealTrackingModel.raw(`
            SUM(CAST(carbs AS REAL)) AS total_carbs,
            SUM(CAST(fat AS REAL)) AS total_fat,
            SUM(CAST(protein AS REAL)) AS total_protein,
            SUM(CAST(calories AS REAL)) AS total_calories,
            SUM(CAST(fiber AS REAL)) AS total_fiber
        `))
            .where({ user_id: userId })
            .whereNotNull('meal_time')
            .andWhere(UserMealTrackingModel.raw('DATE(meal_time) = ?', [end_date]))
            .first();
    }
}
