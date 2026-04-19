import {Router} from "express";
import { authenticateUser } from "../middleware/jwtAuthMiddleware.js";
import { createRoom } from "../controllers/createRoom.js";
import { joinRoom } from "../controllers/joinRoom.js";


const router=Router();

router.post("/createRoom",authenticateUser,createRoom
);
router.post("/joinRoom",authenticateUser,joinRoom)


export default router;