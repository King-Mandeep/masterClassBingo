import {Router} from "express";
import { authenticateUser } from "../middleware/jwtAuthMiddleware.js";
import { getLeaderboard, getUserData } from "../controllers/userController.js";


const router=Router();

router.post("/getMe",authenticateUser,getUserData);
router.get("/getLeaderboard", getLeaderboard);
    
export default router;