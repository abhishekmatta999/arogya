import { Injectable } from '@nestjs/common';
import { GeminiService } from '../services';
import { AIApiClient } from '../interfaces';
import { AiClientsEnum } from '../constants/enum';

@Injectable()
export class AIApiFactory {
    constructor(
        private readonly googleAIApiClient: GeminiService,
    ) {}

    createClient(apiType: AiClientsEnum): AIApiClient {
        switch (apiType) {
            case AiClientsEnum.GEMINI:
                return this.googleAIApiClient;
            default:
                throw new Error(`Invalid API type: ${apiType}`);
        }
    }
}
