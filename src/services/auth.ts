import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, PRIVATE_KEY } from "../config";
import { UserAttributes } from "../model/user.model";
import { parseAuth } from "../utils";
import { getUserById, getUserByName } from "../services/users";
import { ErrorCode } from "../middleware/errors";

const getToken = ({ id }: UserAttributes) => {
  const options = {
    expiresIn: JWT_EXPIRES_IN,
    subject: String(id),
  };
  return jwt.sign({}, PRIVATE_KEY, options);
};

export const getAuthToken = async (auth: string) => {
  const { username, password } = parseAuth(auth);
  if (!auth || !username || !password) {
    throw new Error(ErrorCode.AuthBasic);
  }
  const user = await getUserByName(username);
  if (user && user.isCorrectPassword(password)) {
    return getToken(user);
  } else {
    throw new Error(ErrorCode.AuthForbidden);
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, PRIVATE_KEY);
  } catch (err: unknown) {
    throw new Error(ErrorCode.AuthForbidden);
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
    throw new Error(ErrorCode.AuthForbidden);
  } catch (err: unknown) {
    throw err;
  }
};
