import { Request, Response, NextFunction } from "express";
import { getAuthToken, verifyToken } from "../services/auth";

export const getUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const authBase64: string = String(authorization).replace("Basic ", "");
  getAuthToken(authBase64)
    .then((token) => {
      const claims = verifyToken(token);
      res.status(200).json({ token, claims });
    })
    .catch(next);
};
