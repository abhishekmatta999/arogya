import { BaseModel } from '@squareboat/nestjs-objection';

export class UserMealTrackingModel extends BaseModel {
    static tableName = 'user_meal_tracking';

    id: number;
    user_id: number;
    meal_type: string;
    meal_name: string;
    meal_quantity: string;
    calories: string;
    protein: string;
    fiber: string;
    fat: string;
    meal_time: Date;
    created_at: Date;
    updated_at: Date;
}