import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errorHandler";
import validator from "validator";

interface ValidationCheck {
  value: string;
  check: (value: string) => boolean;
  message: string;
}

// TODO: check user data for creating / updating users

export const checkNewExpense = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const contentType = req.headers["content-type"];
  // TODO: validate categoryId, isPrivate
  const { amount, date, title } = req.body;
  const checks: ValidationCheck[] = [
    {
      value: `${contentType}`,
      check: (value: string) => value === "application/json",
      message: `Content-Type header should be 'application/json'`,
    },
    {
      value: `${date}`,
      check: (value: string) => validator.isDate(value),
      message: `Date should be valid`
    },
    {
      value: `${amount}`,
      check: (value: string) =>
        validator.isFloat(value, { min: 0, max: 1000000 }),
      message: `Amount should be more than 0 and less than 1 million`,
    },
    {
      value: `${title}`,
      check: (value: string) => validator.isLength(value, { min: 4, max: 32 }),
      message: `Title should have 4-32 characters`,
    },
  ];

  const errors = checks.map(
    ({ check, value, message }) =>
      !check(value) && message.concat(`, actual value: '${value}'`)
  ).filter(Boolean).join(", ");
  
  if (errors) {
    next(new CustomError(errors, 422));
  } else {
    next();
  }
};
