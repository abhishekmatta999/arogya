import { AiClientService } from "@app/ai/services/aiClient.service";
import { Inject, Injectable } from "@nestjs/common";
import { UserModuleConstants } from "../constants";
import { UserWorkoutPlanRepositoryContract } from "../repositories";

@Injectable()
export class WorkoutPlanService {
    constructor(
        private aiService: AiClientService,
        @Inject(UserModuleConstants.userWorkoutPlanRepo) private userWorkoutPlanRepo: UserWorkoutPlanRepositoryContract,

    ) {

    }

    async generateWorkoutPlan(userId: number, body: any): Promise<any> {
        const result = await this.aiService.createWorkoutPlan(body);
        return this.userWorkoutPlanRepo.createOrUpdate({ user_id: userId }, { workout_plan: JSON.stringify(result), ...body });
    }

    async getWorkoutPlan(userId: number): Promise<any> {
        const result = await this.userWorkoutPlanRepo.firstWhere({ user_id: userId }, false);
        return result?.workout_plan;
    }
}