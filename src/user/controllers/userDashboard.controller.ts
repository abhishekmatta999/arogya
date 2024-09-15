import { JwtAuthGuard } from "@app/auth/services";
import { UserFitnessDataTransformer, userNextDietItemsToHaveTransformer } from "@app/transformer";
import { Request, Response, RestController } from "@libs/boat";
import { Controller, Get, Post, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { DashboardService } from "../services/dashboard.service";

@Controller({
    path: 'fitness',
    version: "1"
})
export class UserDashboardController extends RestController {
    constructor(private service: DashboardService) {
        super();
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @Post('count')
    async getTotalCount (
        @Req() req: Request,
        @Res() res: Response,
        @Query() params: any
    ) {

        const userId = req?.user?.userId;

        const fitnessData = await this.service.getFitnessCount(userId, params);

        return res.success(
            await this.transform(fitnessData, new UserFitnessDataTransformer(), { req }),
        );
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @Post('nutrients-count')
    async getNutrientCount (
        @Req() req: Request,
        @Res() res: Response,
        @Query() params: any
    ) {
        const userId = req?.user?.userId;

        const nutrientsData = await this.service.getNurientsCount(userId, params);

        return res.success(
            nutrientsData
        );
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @Post('next-diet-items')
    async getNext (
        @Req() req: Request,
        @Res() res: Response,
        @Query() params: any
    ) {
        const userId = req?.user?.userId;

        const items = await this.service.getNextMealsToHave(userId);

        return res.success(
            await this.transform(items, new userNextDietItemsToHaveTransformer(), { req }),
        );
    }
}