import { Request, Response, NextFunction } from "express";
import getLogger from "../../lib/getLogger";
import { Errors } from "./errors";

const logger = getLogger("server");

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  const errorMapping = Errors[err.message];
  let error = "Nieznany błąd";
  let status = 500;

  if (errorMapping) {
    error = err.message;
    status = errorMapping.status;
    res.set(errorMapping.headers);
  }

  logger.error(err.stack);
  res.status(status).json({ error });
};

export default errorHandler;
