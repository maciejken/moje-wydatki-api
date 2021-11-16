import { Router } from 'express';
import { checkUserToken } from '../middleware/auth';
import { addExpense, getExpenses, removeExpense } from '../controllers/expenses';

const router = Router();

router.get('/', checkUserToken, getExpenses);
router.post('/', checkUserToken, addExpense);
router.delete('/:expenseId', checkUserToken, removeExpense);

export const expensesRouter = router;
