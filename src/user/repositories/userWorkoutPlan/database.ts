import { UserWorkoutPlanModel } from '@app/user/models';
import { Injectable } from '@nestjs/common';
import { UserWorkoutPlanRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class UserWorkoutPlanRepository
    extends DatabaseRepository<UserWorkoutPlanModel>
    implements UserWorkoutPlanRepositoryContract {
    @InjectModel(UserWorkoutPlanModel)
    model: UserWorkoutPlanModel;

}