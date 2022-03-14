import { NextFunction, Request, Response } from "express";
import { ExpenseAttributes } from "../model/expense.model";
import {
  createExpense,
  destroyExpense,
  findExpenses,
  getExpensesChartData,
  updateExpense,
} from "../services/expenses";

export const getExpenses = async (req: Request, res: Response) => {
  const date = req.query.date as string;
  const expenses = await findExpenses(date);
  res.status(200).json(expenses);
};

export const getChartData = async (req: Request, res: Response) => {
  const date = req.query.date as string;
  const chartData = await getExpensesChartData(date);
  res.status(200).json(chartData);
};

export const postExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount, categoryId, date, isPrivate, title } = req.body;
  const { userId } = res.locals;
  createExpense({
    amount,
    categoryId,
    date,
    isPrivate,
    title,
    userId,
  } as ExpenseAttributes)
    .then((expense: ExpenseAttributes) => {
      res.status(201).json(expense);
    })
    .catch(next);
};

export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  destroyExpense(req.params.expenseId)
    .then((removed: number) => {
      res.status(201).json({ removed });
    })
    .catch(next);
};

export const patchExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount, categoryId, date, isPrivate, title } = req.body;
  updateExpense(req.params.expenseId, {
    amount,
    categoryId,
    date,
    isPrivate,
    title,
  } as ExpenseAttributes)
    .then((updatedExpense) => {
      res.status(201).json(updatedExpense);
    })
    .catch(next);
};
