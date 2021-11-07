import { NextFunction, Request, Response } from "express";
import { UserAttributes } from "model/user.model";
import { checkPassword, createUser, findUsers } from "../services/users";

export const getUsers = async (req: Request, res: Response) => {
  const userData = await findUsers();
  const users = userData.map(({ id, username, createdAt, updatedAt }: UserAttributes) => ({
    id,
    username,
    createdAt,
    updatedAt
  }))
  res.status(200).json(users);
};

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
  createUser(req.body)
    .then(({ id, username, createdAt, updatedAt }: UserAttributes) => {
      res.status(201).json({ id, username, createdAt, updatedAt });
    })
    .catch(next);
}

export const checkUserPass = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const isCorrectPassword = await checkPassword(userId as string, req.query.password as string);
  const statusCode = isCorrectPassword ? 200 : 401;
  res.status(statusCode).json({ userId, isCorrectPassword, statusCode });
}
