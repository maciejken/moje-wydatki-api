import http from 'http';
import express, {
  Express,
  Request,
  Response,
  NextFunction
} from 'express';
import cors from 'cors';
import { ALLOWED_ORIGIN, API_PREFIX, HTTP_PORT } from './config';
import getLogger from './lib/getLogger';
import { authRouter, expensesRouter, usersRouter } from './routes';
import errorHandler from './middleware/errorHandler';

const app: Express = express();
const logger = getLogger('server');
logger.debug(`Access Control Allow Origin: ${ALLOWED_ORIGIN}`);
app.use(cors({
  origin: ALLOWED_ORIGIN,
  credentials: true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const logRequestStart = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}, client IP ${req.ip}`);
  next();
};
app.use(logRequestStart);

logger.debug(`API prefix is "${API_PREFIX}"`);

app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/expenses`, expensesRouter);
app.use(`${API_PREFIX}/users`, usersRouter);

const logRequestError = (req: Request, res: Response, next: NextFunction) => {
  logger.error(`${req.method} ${req.originalUrl} route not found`);
  next();
};
app.use(logRequestError);
app.use(errorHandler);

const httpServer = http.createServer(app);

httpServer.listen(HTTP_PORT, () => {
  logger.info(`server is running on port ${HTTP_PORT}`);
});
