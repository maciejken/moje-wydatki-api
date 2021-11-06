import { Router } from 'express';
import { getExpenses } from '../controllers/expenses';

const router = Router();

router.get('/', getExpenses);

export const expensesRouter = router;
