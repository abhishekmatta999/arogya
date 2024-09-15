import { BaseModel } from '@squareboat/nestjs-objection';

export class UserWeightModel extends BaseModel {
  static tableName = 'user_weight';

  id: number;
  user_id: number;
  weight: number;
  date: Date;
  created_at: Date;
  updated_at: Date;
}