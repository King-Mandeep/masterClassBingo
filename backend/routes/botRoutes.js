import { Router } from "express";
import { authenticateUser } from "../middleware/jwtAuthMiddleware.js";
import { createBotRoom } from "../controllers/botController.js";

const router = Router();

router.post("/createBotRoom",authenticateUser,createBotRoom);

export default router;