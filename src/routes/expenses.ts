import { Router } from 'express';
import { checkUserToken } from '../middleware/auth';
import { addExpense, getExpenses } from '../controllers/expenses';

const router = Router();

router.get('/', checkUserToken, getExpenses);
router.post('/', checkUserToken, addExpense);

export const expensesRouter = router;
