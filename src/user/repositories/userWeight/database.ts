import { UserWeightModel } from '@app/user/models';
import { Injectable } from '@nestjs/common';
import { UserWeightRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class UserWeightRepository
  extends DatabaseRepository<UserWeightModel>
  implements UserWeightRepositoryContract {
  @InjectModel(UserWeightModel)
  model: UserWeightModel;

  async getWeights(userId: number, startDate: Date, endDate: Date): Promise<any> {
    return UserWeightModel.query().select('weight', 'date')
      .where('user_id', userId)
      .andWhereBetween('date', [startDate, endDate])
  }
}
