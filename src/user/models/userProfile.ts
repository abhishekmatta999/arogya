import { BaseModel } from '@squareboat/nestjs-objection';

export class UserProfileModel extends BaseModel {
  static tableName = 'user_profile';

  id: number;
  user_id: number;
  age: number;
  weight: number;
  height: number;
  gender: string;
  diseases: string[];
  health_preference: string[];
  diet_preference: string[];
  daily_calories_target: number;
  daily_step_count_target: number;
  active: string;
  bmi: number;
  calorie_intake: number;
  created_at: Date;
  updated_at: Date;
}