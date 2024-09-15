import { UserProfileModel } from '@app/user/models';
import { Injectable } from '@nestjs/common';
import { UserProfileRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class UserProfileRepository
  extends DatabaseRepository<UserProfileModel>
  implements UserProfileRepositoryContract {
  @InjectModel(UserProfileModel)
  model: UserProfileModel;

  async getProfileData(userId: number): Promise<any> {
    return UserProfileModel.query().select(
      'user_profile.user_id as id',
      'users.name',
      'user_profile.age',
      'user_profile.weight',
      'user_profile.height',
      'user_profile.gender',
      'user_profile.diseases',
      'user_profile.health_preference',
      'user_profile.diet_preference',
      'user_profile.daily_calories_target',
      'user_profile.daily_step_count_target',
      'user_profile.active',
      'user_profile.weight_target'
    )
      .rightJoin('users', 'users.id', 'user_profile.user_id')
      .where('user_id', userId)
      .first();
  }

  async fetchUserProfileForDashboard(userId: number) {
    return UserProfileModel.query().select('*')
      .where('user_id', userId)
      .first();
  }
}
