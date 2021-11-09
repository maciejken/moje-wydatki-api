import { Request, Response, NextFunction } from "express";
import { getAuthToken } from "../services/auth";

export const getUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const authBase64: string = String(authorization).replace("Basic ", "");
  getAuthToken(authBase64)
    .then((token) => {
      res.status(200).json({ token });
    })
    .catch(next);
};
