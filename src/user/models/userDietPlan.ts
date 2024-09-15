import { BaseModel } from '@squareboat/nestjs-objection';

export class UserDietPlanModel extends BaseModel {
  static tableName = 'user_diet_plan';

  id: number;
  user_id: number;
  meal_type: string;
  meal_name: string;
  meal_eat_type: string;
  meal_quantity: string;
  calories: string;
  protein: string;
  fiber: string;
  fat: string;
  day_id: number
  created_at: Date;
  updated_at: Date;
}