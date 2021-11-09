import { Router } from 'express';
import { getUserToken } from '../controllers/auth';

const router = Router();

router.get('/', getUserToken);

export const authRouter = router;