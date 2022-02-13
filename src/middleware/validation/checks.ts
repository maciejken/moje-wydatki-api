import validator from "validator";
import { PartOfRequest } from "./types";
import { ALLOWED_USERS } from "../../config";
import { getUserByName } from "../../services/users";

const ContentTypeHeaderCheck = {
  in: PartOfRequest.Headers,
  name: "content-type",
  check: (value: string) => value === "application/json",
  message: `Nagłówek 'Content-Type' powinien mieć wartość 'application/json'`,
};

export const Expense = [
  ContentTypeHeaderCheck,
  {
    in: PartOfRequest.Body,
    name: "date",
    check: (value: string) => validator.isDate(value),
    message: "błędna data",
  },
  {
    in: PartOfRequest.Body,
    name: "title",
    check: (value: string) => validator.isLength(value, { min: 4, max: 64 }),
    message: "błędna nazwa",
    hint: "wprowadź 4-64 znaków",
  },
  {
    in: PartOfRequest.Body,
    name: "categoryId",
    check: (value: string) => !value || validator.isInt(value),
    hint: "wprowadź liczbę całkowitą dodatnią",
  },
  {
    in: PartOfRequest.Body,
    name: "isPrivate",
    check: (value: string) => !value || validator.isBoolean(value),
    sanitize: (value: string) => validator.toBoolean(value),
    hint: "wprowadź wartość logiczną true/false",
  },
  {
    in: PartOfRequest.Body,
    name: "amount",
    check: (value: string) =>
      !value || validator.isFloat(value, { min: 0, max: 1000000 }),
    sanitize: (value: string) => (!value && validator.toFloat(value)) || 0,
    message: "błędna kwota",
    hint: "wprowadź wartość z przedziału od 0 do 1 miliona",
  },
];

const AllowedUsers = ALLOWED_USERS
  .split(",")
  .filter(Boolean)
  .map(u => u?.trim());

export const User = [
  ContentTypeHeaderCheck,
  {
    in: PartOfRequest.Body,
    name: "username",
    check: async (value: string) => {
      const isAllowed = AllowedUsers.indexOf(value) >= 0;
      return isAllowed && !(await getUserByName(value));
    },
    message: "niedozwolona nazwa użytkownika",
  },
  {
    in: PartOfRequest.Body,
    name: "password",
    check: (value: string) => validator.isLength(value, { min: 8, max: 24 }),
    message: "hasło musi składać się z 8-24 znaków",
  },
];
