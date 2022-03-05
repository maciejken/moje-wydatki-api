import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth";
import { ErrorCode } from "./errors";

export const checkUserToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    const token = String(authorization).replace("Bearer ", "");
    const claims = verifyToken(token);
    res.locals.userId = parseInt(claims.sub as string);
    next();
  } catch (err: unknown) {
    next(new Error(ErrorCode.AuthBearer));
  }
};
