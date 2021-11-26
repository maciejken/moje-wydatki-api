import { Router } from 'express';
import { checkUserToken } from '../middleware/auth';
import { validate, Expense } from '../middleware/validation';
import { addExpense, getExpenses, removeExpense } from '../controllers/expenses';

const router = Router();

router.get('/', checkUserToken, getExpenses);
router.post('/', checkUserToken, validate(Expense), addExpense);
router.delete('/:expenseId', checkUserToken, removeExpense);

export const expensesRouter = router;
