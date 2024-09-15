import { RestController, Request, Response } from '@libs/boat';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { AiClientService } from '../services/aiClient.service';

@Controller({
  path: 'ai',
  version: "1"
})
export class AiController extends RestController {
  constructor(private service: AiClientService) {
    super();
  }

  @Get('')
    async getPrompResult (
      @Req() req: Request,
      @Res() res: Response,
    ) {
      const result = await this.service.generateReciepe("boiled eggs");

      return res.success(result);
    }
}
