import { Injectable } from "@nestjs/common";

@Injectable()
export class HelperService {
    constructor() {}

    convertProptResultToJson (data: any) {
        try {
            // Remove backticks and the code block formatting
            const cleanedData = data.replace(/```json|```/g, '').trim();
            
            // Parse the cleaned JSON string
            const parsedData = JSON.parse(cleanedData);
    
            return parsedData;
        } catch (error) {
            // return JSON.parse(data)
            console.error("Failed to parse JSON:", error);
            // return null;
            throw error;
        }
    }
}