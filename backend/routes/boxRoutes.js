import {Router} from "express";
import { lockTheBox } from "../controllers/lockingTheBox.js";
import { makeStartingBox } from "../controllers/boxfilling25.js";
import { authenticateUser } from "../middleware/jwtAuthMiddleware.js";


const router=Router();

router.post("/lockBox",authenticateUser,lockTheBox);
router.post("/makeBox",authenticateUser,makeStartingBox);

export default router;