import { Transformer } from '@libs/boat';

export class UserFitnessDataTransformer extends Transformer {

    async transform(fitnessData: Record<string, any>): Promise<Record<string, any>> {
        const { current = {}, profile = {}, name, fit_sync_status} = fitnessData;
        return {
            name: name || "User",
            fit_sync_status: fit_sync_status,
            current: {
                'calories': current?.calories || null,
                'heart_rate': current?.heart_rate || null,
                'step_count': current?.step_count || null,
                'active_minutes': current?.active_minutes || null,
                'date': current?.date || null,
                'distance': current.distance || null
            },
            profile: {
                'daily_step_count_target': profile?.daily_step_count_target || 0, 
                'daily_calories_target': profile?.daily_calories_target || 0,    
                'weight_target': profile?.weight_target || 0.0,                  
                'active': profile?.active || null,                               
                'age': profile?.age || null,                                     // maps to age (integer)
                'weight': profile?.weight || null,                               
                'height': profile?.height || null,                               
                'bmi': profile?.bmi || null,                                     // maps to bmi (real)
                'calorie_intake': profile?.calorie_intake || null,               // maps to calorie_intake (real)
            }
        };
    }

  
}
