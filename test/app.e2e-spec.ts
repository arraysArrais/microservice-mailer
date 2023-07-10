import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../src/mail/mail.service';
import { AppController } from '../src/app.controller';
import { MailModule } from '../src/mail/mail.module';
import { HttpModule } from '@nestjs/axios';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';


describe('microservice', () => {
  let appController: AppController;
  let mailService: MailService;
  let httpService: HttpService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [MailService],
      imports: [ConfigModule.forRoot({ isGlobal: true }), MailModule, HttpModule],
    }).compile();

    appController = app.get<AppController>(AppController);
    mailService = app.get<MailService>(MailService);
    httpService = app.get<HttpService>(HttpService);
  });

  it('controllers and services should be defined', () => {
    expect(appController).toBeDefined;
    expect(mailService).toBeDefined;
    expect(httpService).toBeDefined;
  });

  describe('Wake up request', () => {
    it('Request to server should return 200', async () => {
      const response = await lastValueFrom(httpService.get(process.env.SERVER_URL));
    })
  });

  describe('Auth', () => {
    it('Request to auth endpoint with valid credentials should return a valid token', async () => {
      var token = await mailService.getTokenFromAppServer();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThanOrEqual(80);
    });
  });

  describe('Letters to dispatch', () => {
    it('Request to dispatch endpoint', async () => {
      let token = await mailService.getTokenFromAppServer();
      let lettersToSend: any = await mailService.getLetterstoSend(token);
      expect(lettersToSend).toBeDefined();
      expect(typeof lettersToSend).toBe('object');
    })
  });

  describe('Mail', () => {
    it('Send email', async () => {
      let response = await mailService.sendMail(process.env.RECIPIENT_EMAIL, 'Integration test', 'Hello there!');
      expect(typeof response).toBe('string');
      expect(response).toContain('Email enviado');
    })
  });
});
