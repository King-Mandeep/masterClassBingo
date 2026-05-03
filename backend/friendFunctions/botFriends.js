import { rooms } from "../memory/room.js";

export function playBotMove(roomId, io){
    const room = rooms[roomId];
    if(!room || room.turn !== "BOT")return;
    if(room.processingMove) return;
room.processingMove = true;
    const bot = room.players.playerB;
    const player = room.players.playerA;

    //find unmarked numbers
    const availableMoves = bot.grid
    .map((value, index) => ({ value, index }))
    .filter(({ index }) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      return bot.marked[row][col] === 0;
    });

     if (availableMoves.length === 0) return;

     //pick random move
     const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  const { value, index } = move;

  const row = Math.floor(index / 5);
  const col = index % 5;

   // mark both players
  bot.marked[row][col] = 1;
  player.marked[row][col] = 1;

   // switch turn to human
  room.turn = player.userId;

  io.to(`room:${roomId}`).emit("number:cut", {
    marked: player.marked,
    nextTurn: room.turn
  });
room.processingMove = false;
  console.log("BOT played:", value);


}