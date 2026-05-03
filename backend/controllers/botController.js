import { generateRoomId } from "../friendFunctions/generateRoomId.js";
import { rooms } from "../memory/room.js";

export const createBotRoom = (req,res)=>{
    try{
const roomId = generateRoomId();

rooms[roomId]={
    roomId,

    players: {
        playerA: {
          userId: req.user.userId.toString(),
          grid: [],
          marked: [],
          locked: false,
          isBot: false
        },
        playerB: {
          userId: "BOT",
          grid: [],
          marked: [],
          locked: false,
          isBot: true
        }
        },

      turn: null,
      gameStarted: false,
      processingMove: false
    };
     res.json({
      message: "Bot room created",
      roomId
    });
    }catch(err){
 res.status(500).json({
      message: "Server error",
      err: err.message
    });
    }
};