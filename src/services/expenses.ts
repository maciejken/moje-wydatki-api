import { ExpenseCreationAttributes } from 'model/expense.model';
import { Expense } from '../model';

export const findExpenses = () => Expense.findAll();

export const createExpense = (expenseData: ExpenseCreationAttributes) => Expense.create(expenseData);
