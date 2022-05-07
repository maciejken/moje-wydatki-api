import { Router } from "express";
// import { checkUserToken } from "../middleware/auth";
import { validate, DateQuery } from "../middleware/validation";
import { getIntervals } from "../controllers/calendar";

const router = Router();

router.get("/", validate(DateQuery), getIntervals);

export const calendarRouter = router;
