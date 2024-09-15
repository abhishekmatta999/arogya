import { UserFitnessDataModel } from '@app/user/models';
import { Injectable } from '@nestjs/common';
import { UserFitnessDataRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';
import { TrackFitnessDataDto } from '@app/user/dto';

@Injectable()
export class UserFitnessDataRepository
  extends DatabaseRepository<UserFitnessDataModel>
  implements UserFitnessDataRepositoryContract {
  @InjectModel(UserFitnessDataModel)
  model: UserFitnessDataModel;

  async getUserFitnessData(userId: number, payload: TrackFitnessDataDto): Promise<any> {
    const { start_date, type, end_date } = payload;

    const allColumns = ['user_id', 'date', 'calories', 'step_count', 'heart_rate', 'active_minutes'];
    const selectedColumns = type === 'all' ? allColumns : ['user_id', 'date', type];

    return UserFitnessDataModel.query().select(
      selectedColumns
    ).whereBetween('date', [start_date, end_date])
      .where('user_id', userId)
  }

  async getUserFitnessDataForDashboard (params: any, userId: any) {
    const { end_date = new Date() } = params;

    return UserFitnessDataModel.query().select('*')
    .where({
      'user_id': userId,
      'date': end_date
    }).first();
  }
}
