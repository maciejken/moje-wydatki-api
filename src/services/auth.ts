import { readFileSync } from "fs";
import jwt from "jsonwebtoken";
import { ROOT_DIR, TOKEN_VALIDITY } from "../config";
import { CustomError } from "../middleware/errorHandler";
import { UserAttributes } from "model/user.model";
import { parseAuth } from "../utils";
import { getUserById, getUserByName } from "./users";

const privateKey = readFileSync(`${ROOT_DIR}/keys/priv.key`);

const getToken = ({ id, username }: UserAttributes) => {
    const payload = { username };
    const options = {
      expiresIn: TOKEN_VALIDITY * 1000,
      subject: String(id),
    };
    return jwt.sign(payload, privateKey, options);
};

export const getAuthToken = async (auth: string) => {
  const { username, password } = parseAuth(auth);
  const user = await getUserByName(username);
  if (user && user.isCorrectPassword(password)) {
    return getToken(user);
  } else {
    throw new CustomError('incorrect username or password', 403);
  }
}

const getAuthError = (err: unknown) => {
  let message: string;
  let statusCode: number;
  if (err instanceof Error) {
    message = err.message;
    statusCode = 403;
  } else {
    message = "How could it happen?!? (I'm a teapot)";
    statusCode = 418;
  }
  return new CustomError(message, statusCode);
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, privateKey);
  } catch (err: unknown) {
    throw getAuthError(err);
  }
}

export const refreshToken = async (oldToken: string) => {
  try {
    const verifiedToken = verifyToken(oldToken);
    const userId = parseInt(verifiedToken!.sub as string);
    const user = await getUserById(userId);
    if (user) {
      return getToken(user);
    }
    throw getAuthError(new Error(`User ${userId} not found!`)); 
  } catch (err: unknown) {
    throw getAuthError(err);
  }
};
