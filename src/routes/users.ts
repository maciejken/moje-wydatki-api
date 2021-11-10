import { Router } from 'express';
import { checkUserToken } from '../middleware/auth';
import { addUser, getUsers } from '../controllers/users';

const router = Router();

router.get('/', checkUserToken, getUsers);
router.post('/', addUser);

export const usersRouter = router;