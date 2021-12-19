import { Router } from "express";
import { checkUserToken } from "../middleware/auth";
import { validate, Expense } from "../middleware/validation";
import {
  postExpense,
  getExpenses,
  getChartData,
  deleteExpense,
  patchExpense,
} from "../controllers/expenses";

const router = Router();

router.post("/", checkUserToken, validate(Expense), postExpense);
router.patch("/:expenseId", checkUserToken, patchExpense);
router.delete("/:expenseId", checkUserToken, deleteExpense);

router.get("/chart", checkUserToken, getChartData);
router.get("/", checkUserToken, getExpenses);

export const expensesRouter = router;
