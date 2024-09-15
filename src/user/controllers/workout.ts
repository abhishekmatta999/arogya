import { RestController, Request, Response } from "@libs/boat";
import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { WorkoutPlanService } from "../services";
import { JwtAuthGuard } from "@app/auth/services";
import { WorkoutDto } from "../dto";

@Controller({
    path: 'workout',
    version: "1"
})
export class WorkoutController extends RestController {
    constructor(
        private service: WorkoutPlanService
    ) {
        super();
    }

    @UseGuards(JwtAuthGuard)
    @Post("generate-workout-plan")
    async generateWorkoutPlan(
        @Req() req: Request,
        @Body() body: WorkoutDto,
        @Res() res: Response
    ): Promise<any> {
        const userId = req.user.userId;
        const result = await this.service.generateWorkoutPlan(userId, body);
        return res.success(result)
    }

    @UseGuards(JwtAuthGuard)
    @Post("get-workout-plan")
    async getWorkoutPlan(
        @Req() req: Request,
        @Res() res: Response
    ): Promise<any> {
        const userId = req.user.userId;
        const result = await this.service.getWorkoutPlan(userId);
        return res.success(result);
    }
}