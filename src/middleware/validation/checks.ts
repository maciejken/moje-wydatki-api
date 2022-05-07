import validator from "validator";
import { isDate } from "../../utils/date";
import { PartOfRequest } from "./types";
import { ALLOWED_USERS } from "../../config";
import { getUserByName } from "../../services/users";

const ContentTypeHeaderCheck = {
  in: PartOfRequest.Headers,
  name: "content-type",
  check: (value: string) => value === "application/json",
};

const isExpenseDate = (date: string) =>
  validator.isLength(date, { min: 10, max: 10 }) && validator.isDate(date);

const isExpenseTitle = (value: string) =>
  validator.isLength(value, { min: 3, max: 140 }) && value.startsWith("#");

export const CreateExpenseBody = [
  ContentTypeHeaderCheck,
  {
    in: PartOfRequest.Body,
    name: "date",
    check: (value: string) => isExpenseDate(value),
  },
  {
    in: PartOfRequest.Body,
    name: "title",
    check: (value: string) => isExpenseTitle(value),
  },
  {
    in: PartOfRequest.Body,
    name: "categoryId",
    check: (value: string) => !value || validator.isInt(value),
  },
  {
    in: PartOfRequest.Body,
    name: "isPrivate",
    check: (value: string) => !value || validator.isBoolean(value),
    sanitize: (value: string) => validator.toBoolean(value),
  },
  {
    in: PartOfRequest.Body,
    name: "amount",
    check: (value: string) =>
      !value || validator.isFloat(value, { min: 0, max: 1000000 }),
    sanitize: (value: string) => (!value && validator.toFloat(value)) || 0,
  },
];

export const UpdateExpenseBody = [
  ContentTypeHeaderCheck,
  {
    in: PartOfRequest.Body,
    name: "date",
    check: (value: string) => !value || isExpenseDate(value),
  },
  {
    in: PartOfRequest.Body,
    name: "title",
    check: (value: string) => !value || isExpenseTitle(value),
  },
  {
    in: PartOfRequest.Body,
    name: "categoryId",
    check: (value: string) => !value || validator.isInt(value),
  },
  {
    in: PartOfRequest.Body,
    name: "isPrivate",
    check: (value: string) => !value || validator.isBoolean(value),
    sanitize: (value: string) => validator.toBoolean(value),
  },
  {
    in: PartOfRequest.Body,
    name: "amount",
    check: (value: string) =>
      !value || validator.isFloat(value, { min: 0, max: 1000000 }),
  },
];

const AllowedUsers = ALLOWED_USERS.split(",")
  .filter(Boolean)
  .map((u) => u?.trim());

export const User = [
  ContentTypeHeaderCheck,
  {
    in: PartOfRequest.Body,
    name: "username",
    check: async (value: string) => {
      const isAllowed = AllowedUsers.indexOf(value) >= 0;
      return isAllowed && !(await getUserByName(value));
    },
  },
  {
    in: PartOfRequest.Body,
    name: "password",
    check: (value: string) => validator.isLength(value, { min: 8, max: 24 }),
  },
];

export const ExpensesQuery = [
  {
    in: PartOfRequest.Query,
    name: "date",
    check: (value: string) =>
      !value ||
      (validator.isLength(value, { min: 4, max: 10 }) && isDate(value)),
  },
];

export const DateQuery = [
  {
    in: PartOfRequest.Query,
    name: "date",
    check: (value: string) =>
      !value ||
      (validator.isLength(value, { min: 4, max: 7 }) && isDate(value)),
  },
];
