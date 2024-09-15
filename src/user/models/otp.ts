import { BaseModel } from '@squareboat/nestjs-objection';

export class OtpModel extends BaseModel {
    static tableName = 'otp';

    id: number;
    email: string;
    otp: number;
    verified: boolean;
    created_at: Date;
    updated_at: Date;
}