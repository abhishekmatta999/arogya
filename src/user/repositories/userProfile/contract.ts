import { UserProfileModel } from '@app/user/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface UserProfileRepositoryContract
    extends RepositoryContract<UserProfileModel> {
    getProfileData(userId: number): Promise<any>;

    fetchUserProfileForDashboard(userId: number): Promise<any>;
}
