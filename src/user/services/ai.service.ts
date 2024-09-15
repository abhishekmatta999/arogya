import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleAIFileManager } from "@google/generative-ai/server";
import * as fs from "fs";
import * as Path from "path";
import { UserMealTrackDto } from "../dto";

@Injectable()
export class AiService {
    private client: any;
    private model: any;
    private key: string;
    private fileManager: any;

    constructor(
        private configService: ConfigService
    ) {
        this.key = this.configService.get("GEMINI_API_KEY")
        this.client = new GoogleGenerativeAI(this.key);
        this.model = this.client.getGenerativeModel({ model: this.configService.get("GEMINI_PRIMARY_MODEL") });
        this.fileManager = new GoogleAIFileManager(this.key);
    }

    // get Model
    getModel() {
        if (!this.model) {
            this.model = new GoogleGenerativeAI(this.key).getGenerativeModel({ model: this.configService.get("GEMINI_SECONDARY_MODEL") });
        }
        return this.model;
    }

    // Food Measurement
    async fetchGeminiResults() {
        const prompt = `I have a healty diet application 
        i want to show the quantity of food item to a user 
        please provide me the measurement unit of a food item (in JSON) provided below
        "pulao"`;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

    // Upload file
    async uploadFile() {
        try {
            // Ensure client.files.create is available
            if (!this.client.files || !this.client.files.create) {
                console.error('Error: files.create is not available in the client.');
            }
            const response = await this.client.files.create({
                file: {
                    source: {
                        url: 'https://cdn.tarladalal.com/members/9306/big/big_spicy_vegetable_pulao-16734.jpg',  // Image URL
                    },
                    mimeType: 'image/jpeg',  // MIME type of the image
                    description: 'Spicy Vegetable Pulao',  // Description of the image
                },
            });

            // Log the file URI which will be used in content generation later
            console.log(`File uploaded with URI: ${response.uri}`);

            return response.uri;  // Return the URI for use in the prompt

            // Uploading image from URL directly without file system operations
            // const uploadResult = await this.fileManager.uploadFile(
            //     "https://cdn.tarladalal.com/members/9306/big/big_spicy_vegetable_pulao-16734.jpg", // URL of the image
            //     {
            //         mimeType: "image/jpeg",
            //         displayName: "Spicy Vegetable Pulao",
            //     }
            // );

            // console.log(
            //     `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
            // );

            // // Now use the uploaded file in your AI prompt
            // const result = await this.model.generateContent([
            //     "Tell me the calorie content of this image which is edible.",
            //     {
            //         fileData: {
            //             fileUri: uploadResult.file.uri,
            //             mimeType: uploadResult.file.mimeType,
            //         },
            //     },
            // ]);

            // console.log(result.response.text());
            // return result.response.text();
        } catch (error) {
            console.error("Error uploading file: ", error);
            throw error;
        }
    }

    // Image Description
    async uploadImageToGemini() {

        const prompt = `i have provided you an image of a food item detect the name of the food and give generic nutrition details for the following food item for a generic quantity in a json only (nothing else) containing following keys.
        {
        item_name
        description
        quantity (in g or ml)
        caloriry
        protein 
        fat
        fibers
        
        }`;
        const image = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(Path.join("./files", "burger.jpeg"))).toString("base64"),
                mimeType: "image/jpeg",
            },
        };

        const result = await this.model.generateContent([image, prompt]);
        console.log("--->>", result);

        console.log(result.response.text());
        return result.response.text();
    }

    // Diet Plan
    async createUserDietPlan(userDetails: any) {
        const { age, weight, height, gender, diseases, health_preference, diet_preference,active } = userDetails;

        const dietPrompt = `I am a ${age}-year-old ${gender} with a height of ${height} cm and a weight of ${weight} kg, currently managing the following diseases: ${diseases.join(", ")}. I am ${active} active and My health goals are: ${health_preference.join(", ")}. Please calculate my BMI and, considering my health conditions, generate a 7-day Indian ${diet_preference.join(", ")} diet plan.
        Each meal in the plan should include: 
        Meal type: [edible, drinkable] for each item.
        Quantity in grams (in brackets).
        Calories, protein, fiber, and fat content per item (with units).
        Provide the data in JSON format, ensuring each meal is properly structured with the specified information. In you response give only JSON, so that i can parse it and save it.
        JSON sample:[
            {
                day: 1,
                "meals": [
                    {
                        "meal_type": "",
                        "items": [
                            {
                                "name": "",
                                "type": "",
                                "quantity": "",
                                "calories": "",
                                "protein": "",
                                "fiber": "",
                                "fat": ""
                            },
                        ]
                    }
                ]
            }
        ]. 
        Write units of how much i have to take and what protein ,fiber,fat,calories i will get.
        Note: Remeber to just give json only`

        const result = await this.model.generateContent(dietPrompt);
        const inputText = result.response.text()
        const jsonRemove = inputText.replace("json", "");
        const outputText = jsonRemove.replace("```", "")
        const finalText = outputText.replace("```", "")

        return JSON.parse(finalText);
    }

    // Meal Details
    async fetchMealDetails(body: UserMealTrackDto) {
        const { meal_name, meal_quantity, unit } = body;
        const mealPrompt = `I need to track my meal. I am eating ${meal_quantity} ${unit} of ${meal_name}, Provide following details in JSON.
        JSON Sample: {
            "meal_name": "",
            "meal_quantity": "",
            "calories": "",
            "protein": "",
            "fiber": "",
            "fat": ""
        }
        In JSON do not add units of calories, protein, fiber, fat just give calories number in KCal, and rest in grams
        Calculate all the details according to the quantity i have provide and please generate result in JSON, no extra message
        `;

        const result = await this.model.generateContent(mealPrompt);
        const inputText = result.response.text()
        const jsonRemove = inputText.replace("json", "");
        const outputText = jsonRemove.replace("```", "")
        const finalText = outputText.replace("```", "")

        return JSON.parse(finalText);
    }

    // Reciepe Details 
    async generateReciepe(reciepeName: string) {
        const receipePrompt = `
        I need a reciepe for ${reciepeName}. Please create JSON which contains some description of meal, ingredients and steps.
        Sample JSON:
        {
            "reciepe_name": "",
            "description": "",
            "ingredients": [
                {
                    "ingredient": "",
                    "notes": ""
                }
            ],
            "steps": [
                {
                    "step": "",
                    "notes": ""
                }
            ]
        }`
        const result = await this.model.generateContent(receipePrompt);
        const inputText = result.response.text();
        const jsonRemove = inputText.replace("json", "");
        const outputText = jsonRemove.replace("```", "")
        const finalText = outputText.replace("```", "")

        return JSON.parse(finalText);
    }
}




/**
* 
hi i am 24 year old 185cm and 75 kg male I want to stay very fit so according to my BMI suggest a 7 day meal plan 
    I do have lactose allergy
    and also I want Indian diet only prefer [vegan and vegetarian diet] only
    I want to save this data in a database so give the data in json file
    each meal should include meal type [edible, drinkable] for all elements in json also mention the quantity I should take and calory , protein , fiber , fat  I will get form each item with unit,
    also add quantity in grams in bracket.


    https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnRA-Z1ZwMAcm60_9BeE9Q5x2xFHeMAe-mUQ&s
*/