import { Module } from '@nestjs/common';
import { AiController } from './controllers/aiController';
import { AIApiFactory } from './factory/aiClient.factory';
import { FileService, GeminiService, HelperService, PromptService } from './services';
import { AiApiService } from './services/ai.service';
import { AiClientService } from './services/aiClient.service';

@Module({
    imports: [],
    controllers: [AiController],
    providers: [
        HelperService,
        GeminiService,
        PromptService,
        FileService,
        AiApiService,
        AIApiFactory,
        AiClientService
    ],
})
export class AiModule { }
