import { UserWorkoutPlanModel } from '@app/user/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface UserWorkoutPlanRepositoryContract
    extends RepositoryContract<UserWorkoutPlanModel> {
}