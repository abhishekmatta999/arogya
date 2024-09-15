import { OtpModel } from '@app/user/models';
import { Injectable } from '@nestjs/common';
import { OtpRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class OtpRepository
  extends DatabaseRepository<OtpModel>
  implements OtpRepositoryContract {
  @InjectModel(OtpModel)
  model: OtpModel;
}
