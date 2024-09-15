import { Transformer } from '@libs/boat';

export class userNextDietItemsToHaveTransformer extends Transformer {

    async transform(items: Record<string, any>): Promise<Record<string, any>[]> {
        return items.map(item => {
            return {
                diet_plan_id: item?.id,
                user_id: item?.user_id || null,
                meal_type: item?.meal_type || "",
                meal_name: item?.meal_name || "",
                meal_eat_type: item?.meal_eat_type || "",
                meal_quantity: item?.meal_quantity || "",
                calories: item?.calories || "",
                protein: item?.protein || "",
                fiber: item?.fiber || "",
                fat: item?.fat || "",
                carbs: item?.carbs || "",
                day_id: item?.day_id || null,
                created_at: item?.created_at || null,
                updated_at: item?.updated_at || null,
            };
        });
    }
}
