import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail/mail.service';

@Controller()
export class AppController {
  constructor(
    private readonly mailService: MailService,

    ) { }

  @Get()
  async mailProcess() {
    let token = await this.mailService.getTokenFromAppServer();
    let lettersToSend = await this.mailService.getLetterstoSend();

    lettersToSend.forEach(async (e) => {
      await this.mailService.sendMail(e.recipient_email, e.title, e.content)
    })

    console.log(token);
    console.log(lettersToSend);
  }
}
