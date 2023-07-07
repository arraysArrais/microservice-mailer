// import express from "express";
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

let cachedServer: express.Express;

export const createNestServer = async (): Promise<express.Express> => {
    if (!cachedServer) {
        const expressInstance = express();
        const app = await NestFactory.create(
            AppModule,
            new ExpressAdapter(expressInstance),
        );

        app.enableCors();
        await app.init();
        cachedServer = expressInstance;
    }
    return cachedServer;
};