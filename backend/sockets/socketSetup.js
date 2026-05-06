import { Server } from "socket.io";
import cookie from "cookie";
import { setIO } from "./io.js";
import { rooms } from "../memory/room.js";
import { countBingoLines } from "../friendFunctions/checkBingoLines.js";
import { getUserFromToken } from "../friendFunctions/authFriends.js";
import { playBotMove } from "../friendFunctions/botFriends.js";
import { generateRoomId } from "../friendFunctions/generateRoomId.js";

const playerRoom = {};
let rematchVotes = {}; // roomId → Set of users
const waitingPlayers = [];

const origin = process.env.CLIENT_URL;
export function initSockets(httpServer){
    const io= new Server(httpServer,{
        cors: { origin:process.env.CLIENT_URL, methods:["GET","POST",], credentials:true,

         },
    });

//socket auth middleware (only logged in user)
io.use(async(socket, next)=>{
    try{
        console.log("ye to chala h re baba");
        
        
        
         const raw = socket.request.headers.cookie||"";
         console.log("ye bhi chl gya 2");
          if (!raw){console.log("cookies missing");
           return next(new Error("Cookies missing"));}
          console.log("ye bhi chl gya 3");
           const cookies = cookie.parse(raw);
           console.log("cookies",cookies);
           
            const token = socket.handshake.auth?.token ||
    (cookies.access_token || cookies.token || cookies.jwt);
    console.log("ye bhi chl gya 4");
         // token can be sent via handshake auth or Authorization header
// const token = socket.handshake.auth?.token ||
// (socket.handshake.headers?.authorization || "").startsWith("Bearer ")? socket.handshake.headers.authorization.split(" ")[1]: null;

 if (!token) return next(new Error("Unauthorized: missing token"));

 const player = await getUserFromToken(token); // verifies & returns user
      // attach normalized user info to socket.data
      socket.data.user = {
        id: String(player._id),
        playerName: player.playerName,
      };

       return next();

    }catch(err){
    
         return next(new Error("Unauthorized: " + err.message));
    }
});


     // store io globally
    setIO(io);

    io.on("connection",(socket)=>{
        console.log("socket connected bro!");
         const userId = socket.data.user.id;

           console.log("SOCKET USER:", userId); // ✅ ADD HERE

    //join personal room
    socket.join(`user:${userId}`);
    //confirm to client
    socket.emit("auth:ok",{ userId,userName: socket.data.user.playerName});


     // JOIN GAME ROOM
    socket.on("room:join",(roomId)=>{

        socket.join(`room:${roomId}`);
        playerRoom[userId] = roomId;

        // console.log("ROOM JOIN USER:", userId);
        const room = rooms[roomId];

  let playerA = "";
  let playerB = "";
  if (room) {
    playerA = room.players.playerA?.userId || "";
    playerB = room.players.playerB?.userId || "";
  }

        console.log(`user ${userId} joined room ${roomId}`);

        io.to(`room:${roomId}`).emit("room:playerJoined",{
             playerA,
    playerB
        });

    });
    socket.on("error",(err)=>{
   console.log("Socket error:",err.message);
});

//cutting values
socket.on("cut:number",({roomId,index,value})=>{
    if (index < 0 || index > 24) return;
  const userId= socket.data.user.id;
    const room = rooms[roomId];

   if(!room)return;

   if(!room.gameStarted)return;
   // prevent race condition
if (room.processingMove) {
   socket.emit("move:rejected");
   return;
}

room.processingMove = true;

   const playerA = room.players.playerA;
   const playerB = room.players.playerB;

   let currentPlayer;
   let opponent;

   if(playerA.userId===userId){
    currentPlayer=playerA;
    opponent=playerB;
   }else if(playerB.userId===userId){
    currentPlayer=playerB;
    opponent=playerA;
   }else{
     room.processingMove = false;
    return;
   }

   //validate turn
   if(room.turn !== userId){
  room.processingMove = false;
  return;
}

   //validate value
   if(currentPlayer.grid[index]!==value){
  room.processingMove = false;
  return;
}

 const row = Math.floor(index / 5);
  const col = index % 5;

   // prevent double cut
  if (currentPlayer.marked[row][col] === 1){
  room.processingMove = false;
  return;
}

  // cut current player
  currentPlayer.marked[row][col] = 1;

  // cut opponent board
  const oppIndex = opponent.grid.indexOf(value);

  if (oppIndex !== -1) {

    const rowB = Math.floor(oppIndex / 5);
    const colB = oppIndex % 5;

   if (opponent.marked[rowB][colB] === 0) {
  opponent.marked[rowB][colB] = 1;
}
  }

//checking bingo lines and if current player winning then game over
const lines = countBingoLines(currentPlayer.marked);
// const linesB = countBingoLines(playerB.marked);

if(lines>= 5){

   // send to player A
io.to(`user:${playerA.userId}`).emit("number:cut", {
  value,
  by: userId,
  marked: playerA.marked,
  nextTurn: room.turn
});

// send to player B
io.to(`user:${playerB.userId}`).emit("number:cut", {
  value,
  by: userId,
  marked: playerB.marked,
  nextTurn: room.turn
});

    // room.gameStarted = false;

    const winner =
    currentPlayer.userId;

  io.to(`room:${roomId}`).emit("game:over",{
    winner,
    playerAmarked: playerA.marked,
    playerBmarked: playerB.marked
  });
  room.processingMove = false;
  // delete rooms[roomId];
return; // stop further execution
}



 // switch turn
  room.turn =
    userId === playerA.userId
      ? playerB.userId
      : playerA.userId;
       // emit updated boards
  // send to player A
io.to(`user:${playerA.userId}`).emit("number:cut", {
  value,
  by: userId,
  marked: playerA.marked,
  nextTurn: room.turn
});

// send to player B
io.to(`user:${playerB.userId}`).emit("number:cut", {
  value,
  by: userId,
  marked: playerB.marked,
  nextTurn: room.turn
});


//play bot move if playing with bot
if (room.turn === "BOT") {
  setTimeout(() => {
    playBotMove(roomId, io);
  }, 800);
}


room.processingMove = false;



})


//reset game//rematch
socket.on("game:rematch", ({ roomId }) => {
  console.log(roomId);
  
  console.log("clicked Rematch");
  
  const userId = socket.data.user.id;
console.log(userId);


  if (!rematchVotes[roomId]) {
    rematchVotes[roomId] = new Set();
  }
  console.log("yhan tk aa gye2");
  

  rematchVotes[roomId].add(userId);

  console.log("yha tk a ge 3");
  
  const room = rooms[roomId];
  if (!room) return;
  console.log("yha tk a ge 4");

  const playerA = room.players.playerA.userId;
  const playerB = room.players.playerB.userId;
  console.log("yhan tk age");
  const otherUserId =userId===playerA?playerB:playerA;
   if(otherUserId==="BOT"){
    rematchVotes[roomId].add(otherUserId);
  }
  

  // both players agreed
  if (
    rematchVotes[roomId].has(playerA) &&
    rematchVotes[roomId].has(playerB)
  ) {
    // reset game
    console.log("aagy if k andar");
    
    room.gameStarted = false;
    room.turn = null;

    room.players.playerA.locked = false;
    room.players.playerB.locked = false;

    room.players.playerA.marked = Array(5).fill(0).map(() => Array(5).fill(0));
    room.players.playerB.marked = Array(5).fill(0).map(() => Array(5).fill(0));

    delete rematchVotes[roomId];
console.log("Rematched from backed");
    io.to(`room:${roomId}`).emit("game:reset");
    return;
  }
  io.to(`user:${otherUserId}`).emit("game:onePlayerVoted",{voterId:userId});
});

//online player /random player
socket.on("match:find", () => {
  const userId = socket.data.user.id; // you already attach this in auth
const alreadyWaiting = waitingPlayers.some(p => p.userId === userId);

if (alreadyWaiting) {
  // console.log(" Already in queue:", userId);

  socket.emit("match:error", {
    message: "You are already searching for a match"
  });

  return;
}
  // console.log("🔍 Finding match for:", userId);

  // 🟢 If no one waiting → add to queue
  if (waitingPlayers.length === 0) {
    waitingPlayers.push({
      userId,
      socketId: socket.id
    });

    // console.log("🕒 Added to waiting queue:", userId);

    socket.emit("match:waiting");
  } 
  // 🔵 If someone waiting → match them
  else {
    const opponent = waitingPlayers.shift();

    // console.log("Match found:", userId, "vs", opponent.userId);

    //  Create room
    const roomId = generateRoomId();

    rooms[roomId] = {
      roomId,
      players: {
        playerA: {
          userId: opponent.userId,
          grid: [],
          marked: [],
          locked: false
        },
        playerB: {
          userId: userId,
          grid: [],
          marked: [],
          locked: false
        }
      },
      turn: null,
      gameStarted: false,
      processingMove: false
    };

    playerRoom[userId] = roomId;
playerRoom[opponent.userId] = roomId;

    // join both sockets to room
    socket.join(`room:${roomId}`);
    io.sockets.sockets.get(opponent.socketId)?.join(`room:${roomId}`);

    //  send roomId to both
    socket.emit("match:found", { roomId });
    io.to(opponent.socketId).emit("match:found", { roomId });
  }
});

socket.on("match:cancel", () => {
  const userId = socket.data.user.id;

  console.log("❌ Cancel matchmaking:", userId);

  const index = waitingPlayers.findIndex(p => p.userId === userId);

  if (index !== -1) {
    waitingPlayers.splice(index, 1);
  }
});



      socket.on("disconnect",(reason)=>{

  console.log("socket disconnected",reason);

  // const roomId = rooms[userId];
  // const playerRoom = {}; // userId → roomId
  // remove from matchmaking queue
const index = waitingPlayers.findIndex(p => p.userId === userId);
if (index !== -1) {
  // console.log(" Removing from queue (disconnect):", userId);
  waitingPlayers.splice(index, 1);
}

const roomId = playerRoom[userId];
  if(!roomId) return;

  const room = rooms[roomId];

  if(!room) return;

    if (room) {
  const playerA = room.players.playerA;
  const playerB = room.players.playerB;

  //  If game NOT started → just remove player
  if (!room.gameStarted) {
    if (playerA?.userId === userId) {
      room.players.playerA = null;
    } else if (playerB?.userId === userId) {
      room.players.playerB = null;
    }

    // send updated players to remaining user
    const updatedA = room.players.playerA?.userId || "";
    const updatedB = room.players.playerB?.userId || "";

    io.to(`room:${roomId}`).emit("room:playerJoined", {
      playerA: updatedA,
      playerB: updatedB
    });

    // console.log("👋 Player left before game start:", userId);

    return;
  }
}

  const playerA = room.players.playerA;
  const playerB = room.players.playerB;

  let winner = null;

  if(playerA?.userId === userId){
     winner = playerB?.userId;
  }
  else if(playerB?.userId === userId){
     winner = playerA?.userId;
  }

  if(room.gameStarted && winner){

      io.to(`room:${roomId}`).emit("game:over",{
        winner,
        reason:"opponent_disconnected"
      });

  }

  delete rooms[roomId];
  delete playerRoom[userId];

});
        
    });



return io;
}