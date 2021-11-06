import { Request, Response } from 'express';

export const getExpenses = (req: Request, res: Response) => {
  res.status(200).json([
    {
      id: "e1",
      title: "Toilet Paper",
      amount: 94.12,
      date: "2020-07-14",
    },
    {
      id: "e2",
      title: "New TV",
      amount: 799.49,
      date: "2021-02-12"
    },
    {
      id: "e3",
      title: "Car Insurance",
      amount: 294.67,
      date: "2021-02-28",
    },
    {
      id: "e4",
      title: "New Desk (Wooden)",
      amount: 450,
      date: "2021-05-12",
    },
  ]);
};
