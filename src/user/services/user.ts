import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserDietPlanRepositoryContract, UserFitnessDataRepositoryContract, UserMealTrackingRepositoryContract, UserProfileRepositoryContract, UserRepositoryContract, UserWeightRepositoryContract } from '../repositories';
import { ActiveEnum, GenderEnum, OAuthProvider, PeriodEnum, UserModuleConstants } from '../constants';
import { FoodDto, MealIdDto, MealTrackDto, ReciepeDto, TrackFitnessDataDto, TrackWeightDto, UserMealTrackDto } from '../dto';
import axios from 'axios';
import { AiClientService } from '@app/ai/services/aiClient.service';
import { ConfigService } from '@nestjs/config';
import { PdfService } from './pdf.service';
import { FileService } from '@app/ai';
import { isEmpty } from 'lodash';
import { DashboardService } from './dashboard.service';
import { DayEnum, MealTypesEnum } from '@app/enums';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserModuleConstants.userRepo) private usersRepo: UserRepositoryContract,
    @Inject(UserModuleConstants.userWeightRepo) private userWeightRepo: UserWeightRepositoryContract,
    @Inject(UserModuleConstants.userFitnessDataRepo) private userFitnessDataRepo: UserFitnessDataRepositoryContract,
    @Inject(UserModuleConstants.userDietPlanRepo) private userDietPlanRepo: UserDietPlanRepositoryContract,
    @Inject(UserModuleConstants.userProfileRepo) private userProfileRepo: UserProfileRepositoryContract,
    @Inject(UserModuleConstants.userMealTrackRepo) private userMealTrackRepo: UserMealTrackingRepositoryContract,
    private aiService: AiClientService,
    private configService: ConfigService,
    private pdfService: PdfService,
    private fileService: FileService,
  ) { }

  async get(): Promise<Record<string, any>> {
    return this.usersRepo.firstWhere({});
  }

  async updateWeight(userId: number, weight: number): Promise<any> {
    try {
      const user = await this.usersRepo.firstWhere({ id: userId }, false);
      if (!user) {
        throw new BadRequestException("User do not exists")
      }
      const userProfile = await this.userProfileRepo.firstWhere({ user_id: userId }, false)

      if (userProfile && userProfile.weight == weight) {
        throw new BadRequestException("Weight is same");
      }

      const nowDate = new Date();

      await this.userProfileRepo.createOrUpdate({ user_id: userId }, {
        weight: weight
      })

      await this.userWeightRepo.createOrUpdate({ user_id: userId, date: nowDate }, { weight, updated_at: new Date() })
    } catch (err) {
      throw err;
    }
  }

  async getUserWeights(userId: number, query: TrackWeightDto): Promise<any> {
    try {
      const today = new Date()
      const currentTimeMillis = today.getTime()
      const sevenDaysInMillis = currentTimeMillis - (7 * 24 * 60 * 60 * 1000);
      const startDate = query.start_date || new Date(sevenDaysInMillis);
      const endDate = query.end_date || today
      const user = await this.usersRepo.firstWhere({ id: userId }, false);
      if (!user) {
        throw new BadRequestException("User do not exists")
      }

      return this.userWeightRepo.getWeights(userId, startDate, endDate);
    } catch (err) {
      throw err
    }
  }

  async syncGoogleFit(userId: number): Promise<any> {
    const user: any = await this.usersRepo.firstWhere({ id: userId }, false);
    if (!user) {
      throw new BadRequestException("User do not exists")
    }
    if (user.access_token) {
      return this.syncGoogleFitForGoogleUser(userId)
    }
  }

  async syncGoogleFitForGoogleUser(userId: number): Promise<any> {
    try {
      const user: any = await this.usersRepo.firstWhere({ id: userId }, false);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const currentTimeMillis = today.getTime()
      const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
      const sevenDaysBackInMillis = currentTimeMillis - sevenDaysInMillis;
      const URL = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';
      const body = {
        "aggregateBy": [
          {
            "dataTypeName": "com.google.step_count.delta",
            "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
          },
          {
            "dataTypeName": "com.google.active_minutes"
          },
          {
            "dataTypeName": "com.google.activity.segment"
          },
          {
            "dataTypeName": "com.google.heart_rate.bpm"
          },
          {
            "dataTypeName": "com.google.calories.expended"
          }
        ],
        "startTimeMillis": sevenDaysBackInMillis,
        "bucketByTime": {
          "durationMillis": 86400000
        },
        "endTimeMillis": currentTimeMillis
      };
      const headers = {
        'Authorization': `Bearer ${user.access_token}`,
        'x-client-data': 'CIq2yQEIo7bJAQipncoBCIqCywEIk6HLAQiFoM0BCLrIzQEY9MnNAQ=='
      };
      const { data } = await axios.post(URL, body, { headers });
      const result = data.bucket;
      const fitnessPayload = result.map((item: any) => {
        const time = parseInt(item.endTimeMillis)
        const payload: any = {
          date: new Date(time).toLocaleDateString()
        };
        item.dataset.map((d: any) => {
          if (d.point.length > 0) {
            const name = d.point[0].dataTypeName.split(".")[2];
            // const filteredMap = new Map(d.point[0].value.map(item => [item.intVal, item]));
            const filteredSum = d.point[0].value.reduce((acc, item) => acc + item?.intVal || item.fpVal, 0);
            // const value = d.point[0].value.map()

            payload[name] = filteredSum
          }
        })
        return payload;
      })
      // await this.userFitnessDataRepo.bulkInsert(fitnessPayload);

      await Promise.all(
        fitnessPayload.map((item: any) => {
          return this.userFitnessDataRepo.createOrUpdate({ user_id: user.id, date: item.date }, item);
        })
      );

      await this.usersRepo.updateWhere({ id: user.id }, { fit_sync_status: true });
      return fitnessPayload;
    } catch (err) {
      throw err
    }
  }

  async getUserFitnessData(userId: number, payload: TrackFitnessDataDto): Promise<any> {
    try {
      const user: any = await this.usersRepo.firstWhere({ id: userId }, false);
      if (!user) {
        throw new BadRequestException("User do not exists")
      }
      return this.userFitnessDataRepo.getUserFitnessData(userId, payload);
    } catch (err) {
      throw err;
    }
  }

  async generateMyDietPlan(userId: number): Promise<any> {
    try {
      const user = await this.userProfileRepo.firstWhere({ user_id: userId });
      const result: any = await this.aiService.createUserDietPlan(user);
      const dbPayload = [];
      result.map((item: any) => {
        item.meals.map((meal: any) => {
          meal.items.map((m: any) => {
            dbPayload.push({
              user_id: userId,
              day_id: item.day,
              meal_type: meal.meal_type,
              meal_name: m.name,
              meal_eat_type: m.type,
              meal_quantity: m.quantity,
              calories: m.calories,
              protein: m.protein,
              fiber: m.fiber,
              fat: m.fat,
              carbs: m.carbs
            })
          })
        })
      })

      await this.userDietPlanRepo.deleteWhere({ user_id: userId });
      await this.userDietPlanRepo.bulkInsert(dbPayload);

    } catch (err) {
      console.error('Error fetching response:', err.response?.data || err.message);
      throw err;
    }
  }

  getDayForDate(start_date = new Date()) {
    const dayName = new Date(start_date).toLocaleString('en-IN', { weekday: 'long' });
    return DayEnum[dayName];
  }

  async getMyDietPlan(userId: number, date?: Date): Promise<any> {
    // const day = new Date(date).getDay() + 1;
    let day = null;
    if (date)
      day = this.getDayForDate(date);
    return this.userDietPlanRepo.getMyDietPlan(userId, day);
  }

  async saveProfileData(userId: number, payload: any): Promise<any> {
    try {
      const { name, ...profile } = payload;
      const user = await this.usersRepo.firstWhere({ id: userId }, false);
      if (!user) {
        throw new BadRequestException("User do not exists")
      }

      const bmi = this.calculateBMI(payload.weight, payload.height);
      const calorie_intake = this.calculateCalorieIntake(
        payload.weight,
        payload.height,
        payload.age,
        payload.gender,
        payload.active
      );
      await this.usersRepo.updateWhere({ id: userId }, { name, profile_saved: true });
      await this.userProfileRepo.createOrUpdate({ user_id: userId }, { ...profile, calorie_intake, bmi });
      await this.generateMyDietPlan(userId);
      await this.syncGoogleFit(userId);
    } catch (err) {
      throw err;
    }
  }

  async editProfileData(userId: number, payload: any): Promise<any> {
    try {
      const { name, ...profile } = payload;
      const user = await this.usersRepo.firstWhere({ id: userId }, false);
      if (!user) {
        throw new BadRequestException("User do not exists")
      }
      if (name)
        await this.usersRepo.updateWhere({ id: userId }, { name });
      await this.userProfileRepo.createOrUpdate({ user_id: userId }, profile);
      await this.refreshBMIAndCalorieValues(userId);
    } catch (err) {
      throw err;
    }
  }

  async refreshBMIAndCalorieValues(userId: number) {
    const user = await this.userProfileRepo.firstWhere({ id: userId }, false);
    if (!user) {
      return;
    }
    const bmi = this.calculateBMI(user.weight, user.height);
    const calorie_intake = this.calculateCalorieIntake(
      user.weight,
      user.height,
      user.age,
      user.gender,
      user.active
    );
    await this.userProfileRepo.createOrUpdate({ user_id: userId }, { bmi, calorie_intake });
  }

  calculateBMI(weight: number, height: number) {
    if (height === 0) {
      throw new Error('Height cannot be zero');
    }
    const heightInMeters = height / 100; // Convert height from cm to meters
    const bmi = weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(2)); // Rounds BMI to 2 decimal places
  }

  calculateCalorieIntake(weight: number, height: number, age: number, gender: string, active: string) {
    let bmr = 0;
    if (gender == GenderEnum.MALE) {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    return bmr * ActiveEnum[active];
  }

  async getProfileData(userId: number): Promise<any> {
    return this.userProfileRepo.getProfileData(userId);
  }

  getMealTypeForTime(time: Date): MealTypesEnum {
    const hours = time.getHours();

    if (hours >= 0 && hours < 9) {
      return MealTypesEnum.BREAKFAST;
    } else if (hours >= 9 && hours < 11) {
      return MealTypesEnum.MORNING_SNACKS;
    } else if (hours >= 11 && hours < 14) {
      return MealTypesEnum.LUNCH;
    } else if (hours >= 14 && hours < 17) {
      return MealTypesEnum.EVENING_SNACKS;
    } else if (hours >= 17 && hours < 24) {
      return MealTypesEnum.DINNER;
    } else {
      throw new Error('Time does not fall into any defined meal type');
    }
  }

  async trackUserMeal(userId: number, body: UserMealTrackDto): Promise<any> {
    const details: any = await this.aiService.fetchMealDetails(body);
    let mealType = body.meal_type;
    if (!mealType) {
      mealType = this.getMealTypeForTime(new Date());
    }
    await this.userMealTrackRepo.create({
      ...details,
      user_id: userId,
      meal_type: mealType,
      meal_time: body?.time || new Date()
    })
    return details;
  }

  async getTrackUserMeal(userId: number, query: MealTrackDto): Promise<any> {
    const data = await this.userMealTrackRepo.getTrackUserMeal(userId, query);
    const day = this.getDayForDate();
    const groupByMealPlan = await this.userDietPlanRepo.groupByMealTypePlan(userId, day);
    return groupByMealPlan.map((plan: any) => {
      return {
        ...plan,
        meals: data.filter((p: any) => p.meal_type == plan.meal_type)
      }
    })
  }

  async deleteUserMeal(userId: number, query: MealIdDto): Promise<any> {
    return this.userMealTrackRepo.deleteWhere({ user_id: userId, id: query.meal_id })
  }

  async generateReciepe(query: ReciepeDto): Promise<any> {
    return this.aiService.generateReciepe(query.reciepe_name);
  }

  async checkIfUserExists(userId: any) {
    const user = await this.userProfileRepo.firstWhere({ user_id: userId }, false);

    if (!user) throw new BadRequestException('User Profile not found');

    return user;
  }

  /**
   * get image nutrients details 
   */
  async getImageRecipieDetails(file: any) {
    // fetch details
    return this.aiService.uploadImageToGemini(file);
  }

  async searchFood(query: FoodDto): Promise<any> {
    return this.aiService.searchFood(query.name);
  }
  /**
   * export weekly diet plan
   * @param userId 
   */
  async exportUserWeeklyDiet(userId) {
    const dietPlan = await this.getMyDietPlan(userId);
    if (isEmpty(dietPlan)) throw new BadRequestException("No data found.")

    console.log('dietplan -->>', dietPlan);

    // file path for pdf exporting
    const filePath = await this.pdfService.exportPdf(dietPlan);

    return filePath;
  }
}