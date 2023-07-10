import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
const nodemailer = require("nodemailer");

@Injectable()
export class MailService {
    constructor(private readonly httpService: HttpService) { }

    async getTokenFromAppServer(serverUrl: String, serverUser: String, serverPass: String) {
        const endpoint = serverUrl + 'api/auth/login';

        const requestBody = {
            email: serverUser,
            password: serverPass,
        }
        
        const requestHeaders = {
            'Content-Type': 'application/json; charset=utf-8'
          }

        const response = await lastValueFrom(this.httpService.post(endpoint, requestBody, {
            headers: requestHeaders
        }));

        return response;
    }

    async getLetterstoSend(token: String) {
        const url = process.env.SERVER_URL + 'api/dispatch';
        const requestHeaders = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        const response = await this.httpService.get(url, {
            headers: requestHeaders
        }).pipe(map((res) => res.data)).toPromise();

        return response;

    }

    async sendMail(to, subject, text) {
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

        console.log("Email enviado para " + to + " ID: ", info.messageId);
        return "Email enviado para " + to + " ID: " + info.messageId;
    }
}
