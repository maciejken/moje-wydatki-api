import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, PRIVATE_KEY } from "../config";
import { CustomError } from "../middleware/errorHandler";
import { UserAttributes } from "model/user.model";
import { parseAuth } from "../utils";
import { getUserById, getUserByName } from "./users";

const getToken = ({ id }: UserAttributes) => {
  const options = {
    expiresIn: JWT_EXPIRES_IN,
    subject: String(id),
  };
  return jwt.sign({}, PRIVATE_KEY, options);
};

export const getAuthToken = async (auth: string) => {
  const { username, password } = parseAuth(auth);
  const user = await getUserByName(username);
  if (user && user.isCorrectPassword(password)) {
    return getToken(user);
  } else {
    throw new CustomError("403: nieprawidłowy użytkownik lub hasło", 403);
  }
};

const getAuthError = (err: unknown) => {
  let message: string;
  let statusCode: number;
  if (err instanceof Error) {
    message = `403: ${err.message}`;
    statusCode = 403;
  } else {
    message = "418: Co takiego? (jestem czajnikiem)";
    statusCode = 418;
  }
  return new CustomError(message, statusCode);
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, PRIVATE_KEY);
  } catch (err: unknown) {
    throw getAuthError(err);
  }
};

export const refreshToken = async (oldToken: string) => {
  try {
    const claims = verifyToken(oldToken);
    const userId = parseInt(claims.sub as string);
    const user = await getUserById(userId);
    if (user) {
      return getToken(user);
    }
    throw getAuthError(new Error(`Nie znaleziono użytkownika ${userId}!`));
  } catch (err: unknown) {
    throw getAuthError(err);
  }
};
