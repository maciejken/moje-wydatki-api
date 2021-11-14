import { NextFunction, Request, Response } from "express";
import { ExpenseAttributes } from "model/expense.model";
import { createExpense, findExpenses } from "../services/expenses";

export const getExpenses = async (req: Request, res: Response) => {
  const expenses = await findExpenses();
  res.status(200).json(expenses);
};

export const addExpense = async (req: Request, res: Response, next: NextFunction) => {
  createExpense(req.body)
    .then((expense: ExpenseAttributes) => {
      res.status(201).json(expense);
    })
    .catch(next);
}