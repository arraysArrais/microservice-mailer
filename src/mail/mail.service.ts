import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
const nodemailer = require("nodemailer");

@Injectable()
export class MailService {
  constructor(private readonly httpService: HttpService) { }

  async getTokenFromAppServer() {
    try {
      const url = 'http://localhost:8000/api/auth/login';

      const requestBody = new URLSearchParams({
        email: process.env.SERVER_USER,
        password: process.env.SERVER_PASS,
      });
      const requestHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };

      const response = await this.httpService.post(url, requestBody.toString(), {
        headers: requestHeaders
      }).pipe(map((res) => res.data)).toPromise();

      return response['access_token'];

    } catch (error) {
      console.log(error);
    }
  }

  async getLetterstoSend() {
    try {
      const url = 'http://localhost:8000/api/lettersToSend';
      const requestHeaders = { 'Content-Type': 'application/json' };
      const response = await this.httpService.get(url, {
        headers: requestHeaders
      }).pipe(map((res) => res.data)).toPromise();

      return response;
    }
    catch (error) {
      console.log(error);
    }
  }

  async sendMail(to, subject, text) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });

      console.log("Email enviado para "+to+" ID: ", info.messageId);

    } catch (error) {
      console.error(error);
    }
  }
}
