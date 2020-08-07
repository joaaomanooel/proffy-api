import rateLimit from 'express-rate-limit';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes';

const app = express();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

const handleMorganNumberValues = (val: number): number => {
  try {
    return Number((val / 1000).toFixed(3));
  } catch (e) { return 0; }
};

const handleMorganLogs = (tokens: any, req: Request, res: Response): string => [
  tokens.method(req, res),
  tokens.status(req, res),
  tokens.url(req, res),
  `${handleMorganNumberValues(tokens['response-time'](req, res))}s`,
  handleMorganNumberValues(tokens.res(req, res, 'content-length')), 'KB', '|',
  tokens['user-agent'](req, res),
  `HTTP/${tokens['http-version'](req, res)}`,
  tokens['remote-addr'](req, res), '-',
  tokens['remote-user'](req, res),
  tokens.referrer(req, res),
].join(' ');

app
  .use(express.json())
  .use(router)
  .use(helmet())
  .use(cors())
  .use(limiter)
  .use(morgan(handleMorganLogs))
  .set('trust proxy', 1)
  .use('/api/v1', router)
  .disable('x-powered-by')
  .use(helmet({ frameguard: { action: 'deny' } }))
  .listen(5000, () => console.log('API listening on port 5000'));
