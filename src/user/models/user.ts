import { BaseModel } from '@squareboat/nestjs-objection';

export class UserModel extends BaseModel {
  static tableName = 'users';

  id: number;
  email: string;
  name: string;
  profile_picture_url: string;
  google_id: string;
  oauth_provider: string;
  access_token: string;
  refresh_token: string;
  password_hash: string;
  otp_verified: boolean;
  fit_sync_status: boolean;
  profile_saved: boolean;
  created_at: Date;
  updated_at: Date;
}