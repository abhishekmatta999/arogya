import { TrackFitnessDataDto } from '@app/user/dto';
import { UserFitnessDataModel } from '@app/user/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface UserFitnessDataRepositoryContract
    extends RepositoryContract<UserFitnessDataModel> {
    getUserFitnessData(userId: number, payload: TrackFitnessDataDto): Promise<any>;

    getUserFitnessDataForDashboard (params: any, userId: any);
}
