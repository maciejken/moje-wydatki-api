import getLogger from "../lib/getLogger";
import { Request, Response, NextFunction } from "express";

const logger = getLogger("server");

export class CustomError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.status = status;
  }
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  const message = err.status ? err.message : "Unknown server error";
  logger.error(err.stack);

  res.status(err.status || 500).json({ message });
};

export default errorHandler;
