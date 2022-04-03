import { Router } from "express";
import { checkUserToken } from "../middleware/auth";
import {
  validate,
  CreateExpenseBody,
  ExpenseChartQuery,
  ExpensesQuery,
  UpdateExpenseBody,
} from "../middleware/validation";
import {
  postExpense,
  getExpenses,
  getChartData,
  deleteExpense,
  patchExpense,
} from "../controllers/expenses";

const router = Router();

router.post("/", checkUserToken, validate(CreateExpenseBody), postExpense);
router.patch("/:expenseId([1-9]\\d*)", checkUserToken, validate(UpdateExpenseBody), patchExpense);
router.delete("/:expenseId([1-9]\\d*)", checkUserToken, deleteExpense);

router.get("/chart", checkUserToken, validate(ExpenseChartQuery), getChartData);
router.get("/", checkUserToken, validate(ExpensesQuery), getExpenses);

export const expensesRouter = router;
