import { Router } from 'express';
import { addUser, checkUserPass, getUsers } from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:userId', checkUserPass);

export const usersRouter = router;