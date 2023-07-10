import { Controller, Get, Res } from '@nestjs/common';
import { MailService } from './mail/mail.service';

@Controller()
export class AppController {
  constructor(
    private readonly mailService: MailService,

  ) { }

  @Get()
  async mailProcess(@Res() res) {
    let response = [];

    try {
      let token = await this.mailService.getTokenFromAppServer(process.env.SERVER_URL, process.env.SERVER_USER, process.env.SERVER_PASS);
      console.log('access token retrieved from server: ', token['access_token']);

      let lettersToSend: any = await this.mailService.getLetterstoSend(token['access_token']);
      console.log('Letters to dispatch: ', lettersToSend);

      for (const e of Object.values(lettersToSend) as any) {
        response.push(await this.mailService.sendMail(e.recipient_email, e.title, e.content));
      }

      res.status(200).json(response);
    }
    catch (error) {
      res.status(500).json(error);
      console.error(error);
    }

  }
}
