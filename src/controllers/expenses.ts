import { NextFunction, Request, Response } from "express";
import { ExpenseAttributes } from "model/expense.model";
import { createExpense, deleteExpense, findExpenses } from "../services/expenses";

export const getExpenses = async (req: Request, res: Response) => {
  const expenses = await findExpenses();
  res.status(200).json(expenses);
};

export const addExpense = async (req: Request, res: Response, next: NextFunction) => {
  const { amount, categoryId, date, isPrivate, title } = req.body;
  const { userId } = res.locals;
  createExpense({ amount, categoryId, date, isPrivate, title, userId } as ExpenseAttributes)
    .then((expense: ExpenseAttributes) => {
      res.status(201).json(expense);
    })
    .catch(next);
}


export const removeExpense = async (req: Request, res: Response, next: NextFunction) => {
  deleteExpense(req.params.expenseId)
    .then((removed: number) => {
      res.status(201).json({ removed });
    })
    .catch(next);
}