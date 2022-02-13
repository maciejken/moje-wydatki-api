import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errorHandler";
import { ValidationCheck, ValidationResult } from "./types";

const getValidationResults = async (req: Request, checks: Array<ValidationCheck | Promise<ValidationCheck>>) =>
  (await Promise.all(checks)).map(async (c: ValidationCheck) => {
    const value = req[c.in][c.name];
    const stringValue = value || value === false ? "" + value : "";
    const isValid = await c.check(stringValue);
    let error = isValid ? null : c?.message || `błędna wartość '${c.name}'`;
    if (error) {
      error = error.concat(` (${value})`).concat(c.hint ? `, ${c.hint}` : "");
    }
    return { error, value: c.sanitize ? c.sanitize(stringValue) : value };
  });

const getValidationErrors = async (results: Array<ValidationResult | Promise<ValidationResult>>) =>
  (await Promise.all(results))
    .map((r: ValidationResult) => r.error)
    .filter(Boolean)
    .join("; ");

export const validate =
  (checks: Array<ValidationCheck | Promise<ValidationCheck>>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const results: Array<ValidationResult | Promise<ValidationResult>> = await getValidationResults(req, checks);

    const errors = await getValidationErrors(results);

    if (errors) {
      next(new CustomError(errors, 422));
    } else {
      next();
    }
  };
