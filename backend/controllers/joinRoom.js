import { rooms } from "../memory/room.js";

export const joinRoom = (req, res) => {
  try {
    // console.log("REQ USER FULL:", req.user);
console.log("comes in the api join room");

    const { roomId } = req.body;
    const userId = req.user.userId.toString();

    const room = rooms[roomId];

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
console.log("API USER:", userId);
console.log("PLAYER A:", room.players.playerA.userId);


    if (room.players.playerB) {
      return res.status(400).json({ message: "Room full" });
    }
    // console.log("going with this upper error1");
    

       if (room.players.playerA.userId === userId) {
        console.log("this is the eror");
        
      return res.status(400).json({
        message: "You are already in this room"
      });
    }
console.log("going with this uppererror2");


    room.players.playerB = {
      userId: req.user.userId.toString(),
      grid: [],
      marked: [],
      locked: false
    };

    res.json({
       message: "Joined room successfully",
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