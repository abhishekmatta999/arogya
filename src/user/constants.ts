export class UserModuleConstants {
  static userRepo = 'user_module/user_repo';
  static userWeightRepo = 'user_module/user_weight_repo';
  static userFitnessDataRepo = 'user_module/user_fitness_data_repo';
  static userDietPlanRepo = 'user_module/user_diet_plan_repo';
  static userProfileRepo = 'user_module/user_profile_repo';
  static userMealTrackRepo = 'user_module/user_meal_track_repo';
  static otpRepo = 'user_module/otp_repo';
  static userWorkoutPlanRepo = 'user_module/user_workout_plan_repo';

}


export enum PeriodEnum {
  DATE = 'date',
  TODAY = 'today',
  SEVEN_DAYS = 'seven_days',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year'
}

export enum FitnessTypeEnum {
  ALL = 'all',
  CALORIES = 'calories',
  HEART_RATE = 'heart_rate',
  ACTIVITY = 'activity',
  STEP_COUNT = 'step_count',
  ACTIVE_MINUTES = 'active_minutes'
}

export enum OAuthProvider {
  FORM = 'form',
  GOOGLE = 'google'
}

export enum ActiveEnum {
  Sedentary = 1.2,
  Light = 1.375,
  Moderate = 1.55,
  Very = 1.725,
  Super = 1.9
}

export enum ActiveValuesEnum {
  Sedentary = 'Sedentary',
  Light = 'Light',
  Moderate = 'Moderate',
  Very = 'Very',
  Super = 'Super'
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female'
}