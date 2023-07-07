import { createNestServer } from './app';
import { Express, Request, Response } from 'express';

export const expressFunction = (app: () => Promise<Express>) => {
  return async (req: Request, res: Response): Promise<void> => {
    const server = await app();
    server(req, res);
  };
};

exports.microservice_mailer_nest = expressFunction(createNestServer);