import { Request, Response } from "express";
import { getIntervalsByDate } from "../services/calendar";

export const getIntervals = async (req: Request, res: Response) => {
  const date = req.query.date as string;
  const intervals = await getIntervalsByDate(date);
  res.status(200).json(intervals);
};
