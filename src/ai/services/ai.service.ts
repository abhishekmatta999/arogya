import { Injectable } from '@nestjs/common';
import { AiClientsEnum } from '../constants/enum';
import { AIApiFactory } from '../factory/aiClient.factory';

@Injectable()
export class AiApiService {
    constructor(private readonly aiApiFactory: AIApiFactory) {}

    async getAIPromptResponse(prompt: string, apiType: AiClientsEnum = AiClientsEnum.GEMINI): Promise<string> {
        // create AI client of Factory type
        const aiClient = this.aiApiFactory.createClient(apiType);

        // fetch prompt response from ai model
        return await aiClient.fetchPromptResult(prompt);
    }

    async getAiImageResponse (prompt: string, image: any, apiType: AiClientsEnum = AiClientsEnum.GEMINI) {
        // create AI client of Factory type
        const aiClient = this.aiApiFactory.createClient(apiType);

        // fetch image prompt response from ai model
        return aiClient.fetchImagePromptResult(image, prompt);
    }
}
