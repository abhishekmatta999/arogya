import { BaseModel } from '@squareboat/nestjs-objection';

export class UserWorkoutPlanModel extends BaseModel {
    static tableName = 'user_workout_plan';

    id: number;
    user_id: number;
    primary_goal: string;
    fitness_level: string;
    days_per_week: number;
    duration_per_day: string;
    workout_preference: string;
    workout_plan: any;
    created_at: Date;
    updated_at: Date;
}