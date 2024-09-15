import { UserWeightModel } from '@app/user/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface UserWeightRepositoryContract
    extends RepositoryContract<UserWeightModel> {
    getWeights(userId: number, startDate: Date, endDate: Date): Promise<any>;
}
