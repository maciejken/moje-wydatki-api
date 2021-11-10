import { Router } from 'express';
import { checkUserToken } from '../middleware/auth';
import { getExpenses } from '../controllers/expenses';

const router = Router();

router.get('/', checkUserToken, getExpenses);

export const expensesRouter = router;
