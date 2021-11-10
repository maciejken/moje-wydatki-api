import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth";
import { CustomError } from "./errorHandler";

export const checkUserToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    const token = String(authorization).replace("Bearer ", "");
    verifyToken(token);
    next();
  } catch (err: unknown) {
    let message = 'Generic auth error';
    if (err instanceof Error) {
      message = err.message;
    }
    next(new CustomError(message, 403));
  }
};
