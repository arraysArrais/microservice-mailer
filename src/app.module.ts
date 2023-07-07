import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail/mail.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [MailService],
})
export class AppModule {}
