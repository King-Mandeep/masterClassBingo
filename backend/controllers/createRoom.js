import { generateRoomId } from "../friendFunctions/generateRoomId.js";
import { rooms } from "../memory/room.js";

export const createRoom = (req, res) => {
  try {

    const roomId = generateRoomId();

    rooms[roomId] = {
      roomId,

      players: {
        playerA: {
          userId: req.user.userId.toString(),
          grid: [],
           locked: false,
          marked: []
        },
        playerB: null
      },

      turn: null,
      gameStarted: false,
      processingMove: false 
    };

    res.status(200).json({
      message: "Room created",
      roomId
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
      err: err.message
    });
  }
};