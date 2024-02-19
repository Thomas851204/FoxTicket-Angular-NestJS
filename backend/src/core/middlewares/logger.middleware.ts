import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const now: Date = new Date();
    if (!fs.existsSync('./logs/logs.log')) {
      fs.mkdir('./logs', (err) => {
        if (err) {
          return console.error(err);
        }
      });
      const logStart: string = `Log start: ${now}\n\n`;
      fs.writeFileSync('./logs/logs.log', logStart);
    }
    const firstLine = fs
      .readFileSync('./logs/logs.log', 'utf-8')
      .split('\n')[0]
      .slice(11);
    const prevLogStart = new Date(firstLine);
    if (Math.abs(now.getTime() - prevLogStart.getTime()) / 86400000 > 7) {
      fs.truncateSync('./logs/logs.log', 0);
      const logStart: string = `Log start: ${now}\n`;
      fs.writeFileSync('./logs/logs.log', logStart);
    }
    const reqString: string = `Date: ${new Date()}\nREQUEST\nMethod: ${
      req.method
    }\nURL: ${req.baseUrl ? req.baseUrl : '/'}\n`;
    fs.appendFileSync('./logs/logs.log', reqString);
    res.on('finish', () => {
      const resString: string = `Date: ${new Date()}\nRESPONSE\nStatus code: ${
        res.statusCode
      }\nMessage: ${
        res.statusMessage
      }\n\-------------------------------------------------------------------------\n`;
      fs.appendFileSync('./logs/logs.log', resString);
    });
    next();
  }
}
