import { Router } from "express";
import { checkUserToken } from "../middleware/auth";
import { addUser, getUsers } from "../controllers/users";
import { User, validate } from "../middleware/validation";

const router = Router();

router.get("/", checkUserToken, getUsers);
router.post("/", validate(User), addUser);

export const usersRouter = router;
