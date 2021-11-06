import http from 'http';
import express, {
  Express,
  Request,
  Response,
  NextFunction
} from 'express';
import cors from 'cors';
import 'dotenv/config';
import logger from './lib/logger';
import { expensesRouter } from './routes';

const app: Express = express();
const allowedOrigin = process.env.ALLOWED_ORIGIN;
logger.debug(`Access Control Allow Origin: ${allowedOrigin}`);
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const logRequestStart = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}, client IP ${req.ip}`);
  next();
};
app.use(logRequestStart);

const apiPrefix = process.env.API_PREFIX;
logger.debug(`API prefix is "${apiPrefix}"`);

app.use(`${apiPrefix}/expenses`, expensesRouter);

const logRequestError = (req: Request, res: Response, next: NextFunction) => {
  logger.error(`${req.method} ${req.originalUrl} route not found`);
  next();
};
app.use(logRequestError);

const httpServer = http.createServer(app);
const port = process.env.HTTP_PORT;

httpServer.listen(port, () => {
  logger.info(`server is running on port ${port}`);
});
