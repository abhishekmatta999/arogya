import { OtpModel } from '@app/user/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface OtpRepositoryContract
    extends RepositoryContract<OtpModel> {
}
