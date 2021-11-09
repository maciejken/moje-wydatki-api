import { Router } from 'express';
import { addUser, getUsers } from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.post('/', addUser);

export const usersRouter = router;