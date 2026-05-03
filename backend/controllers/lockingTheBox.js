import { playBotMove } from "../friendFunctions/botFriends.js";
import { make2dArray } from "../friendFunctions/create2dArray.js";
import { randomArray } from "../friendFunctions/randomArray.js";
import { rooms } from "../memory/room.js";
import { getIO } from "../sockets/io.js";

export const lockTheBox=async(req,res)=>{
    try{
      console.log("ok now locking the box in controller");
      
        // const io =req.io;
        const io = getIO();
    const { roomId, grid } = req.body;
  const userId = req.user.userId.toString();;
console.log("here are the total rooms now:",rooms);

  const room = rooms[roomId];
console.log("comed to here1");

  if(!room){
    return res.status(404).json({
      message:"Room not found"
    });
  }
console.log("ok room founded");

// if (!Array.isArray(grid) || grid.length !== 25) {
//   return res.status(400).json({ message: "Invalid grid" });
// }

// const unique = new Set(grid);

// if (unique.size !== 25) {
//   return res.status(400).json({ message: "Duplicate numbers not allowed" });
// }


let player;

  if(room.players.playerA?.userId === userId){
    player = room.players.playerA;
  }
  else if(room.players.playerB?.userId === userId){
    player = room.players.playerB;
  }
  else{
    return res.status(403).json({
      message:"You are not part of this room"
    });
  }


   if(player.locked){
    return res.status(400).json({
      message:"Box already locked"
    });
  }

   player.grid = grid;
  player.marked = make2dArray();
  player.locked = true;

//playing with bot logic 
const opponent = player === room.players.playerA ? room.players.playerB : room.players.playerA;
//bot auto lock logic
if( opponent?.isBot && !opponent.locked ){
  console.log("bot is locking...");

  //generate random grid
const numbers = randomArray();
opponent.grid = numbers;
  opponent.marked = make2dArray();
  opponent.locked = true;

   io.to(`room:${roomId}`).emit("player:locked", {
    userId: "BOT"
  });
  
}


  // notify lock
io.to(`room:${roomId}`).emit("player:locked", { userId });


// check if both players locked
const playerA = room.players.playerA;
const playerB = room.players.playerB;

if(playerA?.locked && playerB?.locked){

   room.gameStarted = true;

    room.turn = Math.random() < 0.5
     ? playerA.userId
     : playerB.userId;

      io.to(`room:${roomId}`).emit("game:start", {
      turn: room.turn
   });
   console.log("Game started in room:", roomId);
  
   if (room.turn === "BOT") {
  setTimeout(() => {
    playBotMove(roomId, io);
  }, 900);
}
  }
  

  res.json({
    message:"Box locked successfully"
  });


    }catch(err){
         console.log(err);
        res.status(500).json({message:"Server error",err: err.message})
    }
}