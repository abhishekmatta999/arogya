import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { AIApiClient } from "@app/ai/interfaces";
import { HelperService } from "../helper.service";


@Injectable()
export class GeminiService implements AIApiClient {
    private client: any;
    private model: any;
    private aiModel: any;
    private key: string;
    private fileManager: any;
    private keys = [];
    private models = [];
    constructor(
        private configService: ConfigService,
        private helperService: HelperService
    ) {
        // this.key = this.configService.get("GEMINI_API_KEY");
        // this.client = new GoogleGenerativeAI(this.key);
        // this.model = this.client.getGenerativeModel({ model: this.configService.get("GEMINI_PRIMARY_MODEL") });
        // this.fileManager = new GoogleAIFileManager(this.key);

        this.keys = [
            this.configService.get("GEMINI_API_KEY"),
            this.configService.get("GEMINI_API_SECONDARY_KEY"),
            this.configService.get("GEMINI_API_Tertiary_KEY"),
        ];

        this.models = [
            this.configService.get("GEMINI_PRIMARY_MODEL"),
            this.configService.get("GEMINI_SECONDARY_MODEL"),
            this.configService.get("GEMINI_PRIMARY_MODEL"),
        ];

        this.setClientAndModel(0);
    }

    /**
     * get prompt result
     * @param prompt 
     * @returns 
     */
    async fetchPromptResult (prompt: string): Promise<any>{
        return this.withRetry(async () => {
            const result = await this.model.generateContent(prompt);
            const inputText = result.response.text();
            // Convert the response to JSON
            console.log(inputText)
            return this.helperService.convertProptResultToJson(inputText);
        });

        // try {
        //     const result = await this.model.generateContent(prompt);

        //     const inputText = result.response.text();

        //     // convert the response to JSON
        //     return this.helperService.convertProptResultToJson(inputText);
        // } catch (error) {
            
        // }
    }

    /**
     * get image prompt result
     * @param image 
     * @param prompt 
     * @returns 
     */
    async fetchImagePromptResult (image, prompt) {
        return this.withRetry(async () => {
            const result = await this.model.generateContent([image, prompt]);
            const inputText = result.response.text();

            // Convert the response to JSON
            return this.helperService.convertProptResultToJson(inputText);
        });
        // try {
        //     const result = await this.model.generateContent([image, prompt]);

        //     const inputText = result.response.text();

        //     // convert the response to JSON
        //     return this.helperService.convertProptResultToJson(inputText);
        // } catch (error) {
            
        // }
    }

    /**
     * Retry logic: Tries up to 3 times with different keys
     * @param callback function that performs the API request
     * @returns the result of the API call
     */
    private async withRetry(callback: () => Promise<any>): Promise<any> {
        for (let attempt = 0; attempt < this.keys.length; attempt++) {
            try {
                if (attempt > 0) {
                    // Switch API key on subsequent attempts
                    this.setClientAndModel(attempt);
                }
                return await callback();
            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed:`, error.message);
                if (attempt === this.keys.length - 1) {
                    throw new Error("All API keys failed.");
                }
            }
        }
    }

    private setClientAndModel(index: number): void {
        this.key = this.keys[index];
        this.aiModel = this.models[index];
        this.client = new GoogleGenerativeAI(this.key);
        this.model = this.client.getGenerativeModel({ model: this.aiModel });
        this.fileManager = new GoogleAIFileManager(this.key);
    }
}