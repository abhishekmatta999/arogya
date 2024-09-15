import { Injectable } from '@nestjs/common';
import { AiClientsEnum } from '../constants/enum';
import { AiApiService } from './ai.service';
import { FileService } from './file.service';
import { PromptService } from './prompt.service';

@Injectable()
export class AiClientService {
    constructor(
        private readonly apiService: AiApiService,
        private readonly promptService: PromptService,
        private readonly fileService: FileService,
    ) { }

    // Image Description
    async uploadImageToGemini(file: any) {
        // prompt service
        const prompt = this.promptService.getUploadedImageDetailsPrompt();

        const image = {
            inlineData: {
                data: this.fileService.getBufferedFile(file?.filename || file?.originalname),
                mimeType: file?.mimetype,
            },
        };

        // result
        const result = await this.apiService.getAiImageResponse(prompt, image);

        this.fileService.removeFile(file?.filename || file?.originalname)

        return result;
    }

    // Diet Plan
    async createUserDietPlan(userDetails: any) {
        // prompt service
        const dietPrompt = this.promptService.getUserDietPlanPrompt(userDetails);

        // fetch ai response
        const result = await this.apiService.getAIPromptResponse(dietPrompt);

        return result;
    }

    // Meal Details
    async fetchMealDetails(body: any) {
        // prompt service
        const mealPrompt = this.promptService.getMealInfoPrompt(body);

        // fetch ai response
        const result = await this.apiService.getAIPromptResponse(mealPrompt);

        return result;
    }

    // Reciepe Details 
    async generateReciepe(reciepeName: string) {
        // prompt service
        const receipePrompt = this.promptService.getRecipiePrompt({ reciepeName });

        // fetch ai response
        const result = await this.apiService.getAIPromptResponse(receipePrompt);

        return result;
    }

    async searchFood(name: string) {
        const listPrompt = this.promptService.getFoodListPrompt({ name });

        // fetch ai response
        const result = await this.apiService.getAIPromptResponse(listPrompt);

        return result;
    }

    // Diet Plan
    async createWorkoutPlan(userDetails: any) {
        // prompt service
        const dietPrompt = this.promptService.getUserWorkoutPlanPrompt(userDetails);

        console.log(dietPrompt)
        // fetch ai response
        const result = await this.apiService.getAIPromptResponse(dietPrompt);

        return result;
    }
}
