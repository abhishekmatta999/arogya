import { BaseModel } from '@squareboat/nestjs-objection';

export class UserFitnessDataModel extends BaseModel {
  static tableName = 'user_fitness_data';

  id: number;
  user_id: number;
  date: Date;
  step_count: number;
  active_minutes: number;
  activity: number;
  calories: number;
  heart_rate: number;
  created_at: Date;
  updated_at: Date;
}