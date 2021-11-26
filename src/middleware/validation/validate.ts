import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errorHandler";
import { ValidationCheck, ValidationResult } from "./types";

// TODO: check user data for creating / updating users

const getValidationResults = (req: Request, checks: ValidationCheck[]) =>
  checks.map((c: ValidationCheck) => {
    const value = req[c.in][c.name];
    const stringValue = value || value === false ? "" + value : "";
    let error = c.check(stringValue)
      ? null
      : c?.message || `błędna wartość '${c.name}'`;
    if (error) {
      error = error.concat(` (${value})`).concat(c.hint ? `, ${c.hint}` : "");
    }
    return { error, value: c.sanitize ? c.sanitize(stringValue) : value };
  });

const getValidationErrors = (results: ValidationResult[]) =>
  results
    .map((r: ValidationResult) => r.error)
    .filter(Boolean)
    .join("; ");

export const validate = (checks: ValidationCheck[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const results: ValidationResult[] = getValidationResults(req, checks);

  const errors = getValidationErrors(results);

  if (errors) {
    next(new CustomError(errors, 422));
  } else {
    next();
  }
};
