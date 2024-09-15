export interface AIApiClient {
    fetchPromptResult(prompt: string): Promise<any>;
    fetchImagePromptResult(image: any, prompt: string): Promise<any>;
}