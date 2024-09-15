import { Injectable } from "@nestjs/common";

@Injectable()
export class PromptService {
    constructor() { }

    /**
     * to fetch the recipie prompt
     * @returns prompt: string
     */
    getRecipiePrompt(params: any = {}) {
        const { reciepeName } = params;

        return `
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
    }

    getFoodListPrompt(params: any = {}) {
        const { name } = params;
        return `
        I need a food item list with details, i will provide a food name, search foods for search keyword ${name}.
        JSON sample:
        [
            {
                name: "",
                food_type: "",
                quantity: "",
                unit: "",
                calories: "",
                fiber: "",
                carbs: "",
                fat: ""
            }
        ]
        Note: Please provide json only. mention food type edible or drinkable, give basic quantity and unit like 100 grams, 1 piece, 100 ml, so that i can calories for any quantity. In quantity just give quantity and in unit give unit.`
    }

    /**
     * to fetch the meal information prompt
     * @returns prompt: string
     */
    getMealInfoPrompt(params: any = {}) {
        const {
            meal_quantity, unit, meal_name
        } = params;

        return `I need to track my meal. I am eating ${meal_quantity} ${unit} of ${meal_name}, Provide following details in JSON.
        JSON Sample: {
            "meal_name": "",
            "meal_type": "",
            "meal_quantity": "",
            "meal_unit": "",
            "calories": "",
            "protein": "",
            "fiber": "",
            "fat": "",
            "carbs": ""
        }
        In JSON do not add units of calories, protein, fiber, fat just give calories number in KCal, and rest in grams
        Calculate all the details according to the quantity i have provide and please generate result in JSON, no extra message
        `;
    }

    /**
     * to fetch user diet plan prompt
     * @returns prompt: string
     */
    getUserDietPlanPrompt(params: any = {}) {
        const {
            age,
            gender,
            height,
            weight,
            diseases,
            active,
            health_preference,
            diet_preference
        } = params;

        return `I am a ${age}-year-old ${gender} with a height of ${height} cm and a weight of ${weight} kg, currently managing the following diseases: ${diseases.join(", ")}. I am ${active} active and My health goals are: ${health_preference.join(", ")}. Please calculate my BMI and, considering my health conditions, generate a 7-day Indian ${diet_preference.join(", ")} diet plan.
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
                                "fat": "",
                                "carbs": ""
                            },
                        ]
                    }
                ]
            }
        ]. 
        Write units of how much i have to take and what protein ,fiber,fat,calories, carbs i will get.
        Note: Remember to just give json only and do not provide any units in any of the items just number. meal type can have only values breakfast, lunch, evening snacks, dinner, morning snacks`
    }

    /**
     * to fetch uploaded image details prompt
     * @returns prompt: string
     */
    getUploadedImageDetailsPrompt() {
        return `i have provided you an image of a food item detect the name of the food and give generic nutrition details for the following food item for a generic quantity in a json only (nothing else) containing following keys.
        {
        name
        description
        quantity
        calorie
        protein
        fat
        fibers
        carbs
        unit
        }
        Note: Remember to just give json only and do not provide any units in any of the items just number, write quantity unit in unit key
        Remember: Take a basic unit like 100 grams, 100 ml, 1 piece, so that i can calculate any quantity data, also in quantity just give numebr, and in unit give unit.`;
    }


    searchFoodPrompt(name: string) {
        return `I need a food item list with details, i will provide a food name, search foods for search keyword ${name}.
        JSON sample:
        [
            {
                name: "" //string,
                food_type: "" //string,
                quantity: ""//number,
                unit: ""//string,
                calories: ""//number,
                fiber: ""//number,
                carbs: ""//number,
                fat: ""//number
            }
        ]
Note: Please provide json only strictly in data type mentioned. mention food type edible or drinkable, do not add any unit like 'g' or 'gram' in (calories,fiber,carbs,fat) keys only numeric value. write unit in unit key only. give basic quantity (1,10,100) and unit like grams, piece, ml, so that i can calculate calories,fiber,carbs,fat for any quantity.`
    }

    getUserWorkoutPlanPrompt(body: any) {
        const { primary_goal, fitness_level, days_per_week, duration, workout_preference } = body;
        return `I want a workout plan. My primary goal is to ${primary_goal}, and my fitness level is ${fitness_level}. I want to excercise ${days_per_week} days per week for ${duration} and my workout preferences are ${workout_preference.join(", ")}. Create aplan for me
        Create a json in which we will have day and its excercises
        JSON Sample:
        [
            {
                "day": "",
                "excercises": [
                    {
                        name: "",
                        sets: "",
                        reps: "",
                        note: ""
                    }
                ]
            }
        ]
        Note: Please provide only json.`
    }
}

