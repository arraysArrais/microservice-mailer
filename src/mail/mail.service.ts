import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
const nodemailer = require("nodemailer");

@Injectable()
export class MailService {
    constructor(private readonly httpService: HttpService) { }

    async getTokenFromAppServer() {
        const url = process.env.SERVER_URL + 'api/auth/login';

        const requestBody = {
            email: process.env.SERVER_USER,
            password: process.env.SERVER_PASS,
        }
        
        const requestHeaders = {
            'Content-Type': 'application/json; charset=utf-8'
          }

        const response = await this.httpService.post(url, requestBody, {
            headers: requestHeaders
        }).pipe(map((res) => res.data)).toPromise();

        return response['access_token'];
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