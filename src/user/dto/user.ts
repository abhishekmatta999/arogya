import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { ActiveValuesEnum, FitnessTypeEnum, GenderEnum, PeriodEnum } from "../constants";
import { Transform, Type } from "class-transformer";
import { DaysPerWeek, DurationPerDay, FitnessLevel, MealTypesEnum, PrimaryGoal, WorkoutPreference } from "@app/enums";

export class UserIdDto {
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    user_id: number;
}

export class UserWeightDto {
    @IsNotEmpty()
    @IsNumber()
    weight: number;
}

export class TrackWeightDto {
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    start_date: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    end_date: Date;
}

export class TrackFitnessDataDto {
    @IsEnum(FitnessTypeEnum)
    type: string;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    start_date: Date;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    end_date: Date;
}

export class ProfileDto {
    @IsString()
    name: string;

    @IsNumber()
    age: number;

    @IsNumber()
    weight: number;

    @IsNumber()
    height: number;

    @IsEnum(GenderEnum)
    gender: string;

    @IsArray()
    @IsString({ each: true })
    diseases: string[]

    @IsArray()
    @IsString({ each: true })
    health_preference: string[]

    @IsArray()
    @IsString({ each: true })
    diet_preference: string[];

    @IsNumber()
    daily_step_count_target: number;

    @IsNumber()
    daily_calories_target: number;

    @IsEnum(ActiveValuesEnum)
    active: string;

    @IsNumber()
    weight_target: number;
}

export class EditProfileDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    age: number;

    @IsOptional()
    @IsNumber()
    weight: number;

    @IsOptional()
    @IsNumber()
    height: number;

    @IsOptional()
    @IsEnum(GenderEnum)
    gender: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    diseases: string[]

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    health_preference: string[]

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    diet_preference: string[];

    @IsOptional()
    @IsNumber()
    daily_step_count_target: number;

    @IsOptional()
    @IsNumber()
    daily_calories_target: number;

    @IsOptional()
    @IsEnum(ActiveValuesEnum)
    active: string;

    @IsOptional()
    @IsNumber()
    weight_target: number;
}

export class UserMealTrackDto {
    @IsString()
    meal_name: string;

    @IsEnum(MealTypesEnum)
    meal_type: string;

    @IsNumber()
    meal_quantity: number;

    @IsString()
    unit: string;

    @IsOptional()
    time: Date;
}

export class MealTrackDto {
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    date: Date;
}

export class MealIdDto {
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    meal_id: number;
}

export class ReciepeDto {
    @IsString()
    reciepe_name: string;
}

export class GetTodayPlanDto {
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    date: Date;
}

export class FoodDto {
    @IsString()
    name: string;
}

export class WorkoutDto {
    @IsEnum(PrimaryGoal)
    primary_goal: string;

    @IsEnum(FitnessLevel)
    fitness_level: string;

    @IsEnum(DaysPerWeek)
    days_per_week: number;

    @IsEnum(DurationPerDay)
    duration: string;

    // @IsEnum(WorkoutPreference)
    // workout_preference: string;

    @IsArray()
    @IsEnum(WorkoutPreference, { each: true })
    workout_preference: string[]

}