import { useState, useEffect } from "react";
import { connectSocket, getSocket } from "../services/socket";
import axios from "axios";

export const RoomControls = ({ setRoomId }) => {
  const [inputRoom, setInputRoom] = useState("");
  const [players, setPlayers] = useState([]);

const [loading, setLoading] = useState(false);
const [joinLoading,setJoinLoading]=useState(false);
const buttonStyle = (disabled) => ({
  width:"100%",
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  background: disabled ? "#374151" : "#6366f1",
  color: "white",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  transition: "0.2s",
  boxShadow: disabled
    ? "none"
    : "0 4px 14px rgba(99,102,241,0.5)",
    marginBottom:"15px"
});

  useEffect(() => {
    const socket = connectSocket();

    // when someone joins
    socket.on("room:playerJoined", ({ playerA,
    playerB }) => {
      const updatedPlayers = [playerA, playerB].filter(Boolean);
  setPlayers(updatedPlayers);
    });

    return () => {
      socket.off("room:playerJoined");
    };
  }, []);

  // 🟢 Create Room
  const handleCreateRoom = async() => {
    setLoading(true);
    const socket = getSocket();
    if (!socket) return;

    // simple random roomId
    // const newRoomId = Math.random().toString(36).substring(2, 8);

const res = await axios.post(`${import.meta.env.VITE_API_URL}/room/createRoom`, {}, {
  withCredentials: true
});

const roomId = res.data.roomId;

    socket.emit("room:join",roomId);

    setRoomId(roomId);
    setInputRoom(roomId);
setLoading(false)
    console.log("Room created:",roomId);
  };

  // 🔵 Join Room
  const handleJoinRoom = async() => {
    setJoinLoading(true);
    const socket = getSocket();
    if (!socket) return;

    if (!inputRoom) return alert("Enter room ID");

 await axios.post(
    `${import.meta.env.VITE_API_URL}/room/joinRoom`,
    { roomId: inputRoom }, 
    { withCredentials: true }
  );

    socket.emit("room:join", inputRoom);

    setRoomId(inputRoom);
setJoinLoading(false);
    // console.log("Joined room:", inputRoom);
  };

  return (
    <div style={{
  marginTop: "20px",
  padding: "16px",
  background: "#111827",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "500px",
  margin: "0 auto",
  boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
}}>
      <h2 style={{
  textAlign: "center",
  marginBottom: "15px"
}}>
   Game Lobby
</h2>

      {/* Create */}
     <button
  onClick={handleCreateRoom}
  style={buttonStyle(loading)}
  disabled={loading}
>
  Create Room 
</button>

      {/* Join */}
     <div style={{
   display: "flex",
  gap: "10px",
  flexWrap: "wrap"
}}>
  <input
    type="text"
    placeholder="Enter Room ID"
    value={inputRoom}
    onChange={(e) => setInputRoom(e.target.value)}
    style={{
       flex: "1 1 100%",
      padding: "10px",
      borderRadius: "8px",
      border: "none",
      background: "#1f2937",
      color: "white",
      outline: "none"
    }}
  />

  <button
    onClick={handleJoinRoom}
    disabled={joinLoading}
    style={buttonStyle(joinLoading)}
  >
    Join
  </button>
</div>

      {/* Info */}
     <div style={{ marginTop: "15px" }}>
  <p style={{ color: "#9ca3af", marginBottom: "6px" }}>
    Players:
  </p>

  {players.length === 0 && (
    <p style={{ color: "#6b7280" }}>No players yet</p>
  )}

  {players.map((p, i) => (
    <div
      key={i}
      style={{
         padding: "6px 10px",
        borderRadius: "8px",
        background: "#1f2937",
        marginBottom: "5px",
        fontSize: "13px",
        wordBreak: "break-word",
      }}
    >
      👤 {p.slice(-5)}
    </div>
  ))}
</div>
    </div>
  );
};