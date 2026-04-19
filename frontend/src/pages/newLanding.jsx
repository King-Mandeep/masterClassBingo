import { useEffect, useRef, useState } from "react";
import { RoomControls } from "../components/RoomControls";
import { getSocket } from "../services/socket";
import { BingoBoard } from "../components/bingoBoard";
import { lockBox, makeBox } from "../services/gameApi";
import { GameLogger } from "../components/GameLogger";
import { Navbar } from "../components/navbar";
import Modal from "../components/modalComponent";

export const Landing = () => {
  const roomIdRef = useRef("");
  const [roomId, setRoomId] = useState("");
  const [isFilled,setIsFilled]=useState(false);
  const [isLocked,setIsLocked]=useState(false);
  const [resetVoted,setResetVoted]=useState(false);
  const [opponentLocked,setOpponentLocked]=useState(false);
  const [IsMyTurn,setIsMyTurn]=useState(false);
  const [GameStarted,setGameStarted]=useState(false);
  const [grid, setGrid] = useState([]);
  const [marked,setMarked]=useState(
    Array(5).fill(0).map(()=>Array(5).fill(0))
  );
  const [logs,setLogs]= useState([]);
  const myId= localStorage.getItem("userId");
  const [gameOver, setGameOver] = useState(false);
const [winner, setWinner] = useState(null);
const [modalData,setModalData]= useState(null);




const buttonStyle = (disabled) => ({
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  background: disabled ? "#374151" : "#6366f1",
  color: "white",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: "bold",
  transition: "0.2s",
  boxShadow: disabled
    ? "none"
    : "0 4px 14px rgba(99,102,241,0.5)"
});

const rematchStyle = {
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  background: "#22c55e",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 4px 14px rgba(34,197,94,0.5)"
};




const addLog = (msg) => {
  setLogs(prev => [...prev, msg]);
};
const clearLog = ()=>{
  setLogs([]);
}

  const handleFillBox = async ()=>{
    try{
const numbers = await makeBox();
console.log(numbers);

setGrid(numbers);
setIsFilled(true);
addLog("Box Filled");
// console.log("yhan tk ho gya");
// console.log(grid);


    }catch(err){
      console.error(err);
    }
  }

  const handleLockBox = async()=>{
    try{
await lockBox(roomId,grid);

setIsLocked(true);

    }catch(err){
      console.log(err);
      
    }
  }


  const handleCellClick=(index,value)=>{
    if(!IsMyTurn)return;
    const socket = getSocket();

    socket.emit("cut:number",{
      roomId,index,value
    });
  };

  const handleRematch = () => {
    console.log("hR function called");
    
  const socket = getSocket();
  console.log("ROOM ID SENT:", roomIdRef.current);
  // let pass=roomId?roomId:roomIdParam;

  socket.emit("game:rematch", { roomId:roomIdRef.current });
  setResetVoted(true);
  
};

const showModal = (message,options = {},btnText)=>{
  const { onBtnClick } = options;

  setModalData({
    message: message,
    showBtn:btnText?true:false,
    btnText:btnText,
    onBtnClick:onBtnClick
  });
};



  useEffect(()=>{
const socket = getSocket();
if(!socket)return;
roomIdRef.current=roomId;

socket.on("player:locked",({userId})=>{
  const myId=localStorage.getItem("userId");
  let locker="Opponent";
  if(userId!==myId){
    setOpponentLocked(true);
    locker="You";
  }
  console.log("player locked:",userId);
  addLog(`${locker} locked the board`);
  
});

socket.on("game:start",({turn})=>{
  setGameStarted(true);
  const myId= localStorage.getItem("userId");
  setIsMyTurn(turn===myId);
  addLog("Game Started")
});

socket.on("number:cut",(data)=>{
  setMarked(data.marked);

  const myId=localStorage.getItem("userId");

  setIsMyTurn(data.nextTurn === myId);
  addLog("Move played");
});

socket.on("game:over", (data) => {
  // alert(`Winner: ${data.winner}`);
   setGameOver(true);
   let vijeta = myId==data.winner?"You":"Opponent";
  setWinner(data.winner);

  addLog(`Game Over`);
  showModal(`${vijeta} Won!`);
  clearLog();
  // setGameStarted(false);
  // setOpponentLocked(false);
  // setIsLocked(false);
  // setIsFilled(false);
  // setResetVoted(false);
// const toLog = myId === data.winner
//   ? "You are the winner "
//   : "Opponent is winner";
});

socket.on("game:reset", () => {
  console.log("gameReset comed in frontend");
  
  setGameStarted(false);
  setOpponentLocked(false);
  setIsLocked(false);
  setIsFilled(false);
  setResetVoted(false);
  setMarked(Array(5).fill(0).map(() => Array(5).fill(0)));
  setGrid([]);
  setGameOver(false);
setWinner(null);
  addLog("Game Reseted")
  setModalData(null);
  showModal(`Game Reseted`);
  clearLog();
  // console.log("gameReset end in frontend");
});

socket.on("game:onePlayerVoted",({voterId})=>{
  console.log("on player voted socket on on frontend");
  
  let voter= myId==voterId?"You":"Opponent";
  addLog(`${voter} Voted for Rematch/Reset`);
  showModal(`${voter} voted for rematch/reset, Waiting for you.`,{onBtnClick:handleRematch},"Aceept Reset/Rematch");
});


return () => {
    socket.off("player:locked");
    socket.off("game:start");
  };
  },[roomId]);

  return (
    <>
    {modalData && (
        <Modal
          message={modalData.message}
          showBtn={modalData.showBtn}
          btnText={modalData.btnText}
          onBtnClick={modalData.onBtnClick}
          onClose={() => setModalData(null)}
        />
      )}
    <nav>
      <Navbar/>
    </nav>
    <div>
      <RoomControls setRoomId={setRoomId} />

     {roomId && (
  <div style={{
    marginTop: "10px",
    textAlign: "center",
    color: "#9ca3af"
  }}>
    Room ID: <b style={{ color: "#22c55e" }}>{roomId}</b>
  </div>
)}
    </div>

<div style={{
  display: "flex",
  gap: "12px",
  justifyContent: "center",
  marginTop: "20px",
  flexWrap: "wrap"
}}>
  <button
  onClick={handleFillBox}
  disabled={isFilled}
  style={buttonStyle(isFilled)}
>
  {isFilled ? "Box Filled" : "Fill Box"}
</button>
<button
  onClick={handleLockBox}
  disabled={!isFilled || isLocked}
  style={buttonStyle(isLocked)}
>
  {isLocked ? "Locked" : "Lock Box"}
</button>
<button onClick={handleRematch}
style={buttonStyle(resetVoted)}
disabled={resetVoted}
>
Rematch
</button>
</div>


<div style={{
  display: "flex",
  gap: "20px",
  marginTop: "30px",
  alignItems: "flex-start",
  justifyContent: "center"
}}>
  <div style={{
  flex: 2,
   maxWidth: "700px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: "20px"
}}>
<div style={{
  marginTop: "20px",
  textAlign: "center"
}}>
  {GameStarted ? (
    <div style={{
      padding: "10px 20px",
      borderRadius: "12px",
      display: "inline-block",
      background: IsMyTurn ? "#065f46" : "#78350f",
      color: "white",
      fontWeight: "bold",
      fontSize: "16px"
    }}>
      {IsMyTurn ? "🟢 Your Turn" : "🟠 Opponent's Turn"}
    </div>
  ) : (
    <div style={{
      padding: "10px 20px",
      borderRadius: "12px",
      background: "#1f2937",
      color: "#9ca3af"
    }}>
      Waiting for opponent...
    </div>
  )}
</div>

<div>
  {grid?.length > 0 && (
  <BingoBoard
    grid={grid}
  marked={marked}
  onCellClick={handleCellClick}
  isMyTurn={IsMyTurn}
  />
)}
</div>
<div>
  {opponentLocked && (
  <p style={{ color: "green" }}>
    Opponent locked their box 
  </p>
)}
</div>

{gameOver && (
  <div style={{
    marginTop: "20px",
    padding: "20px",
    background: "#111827",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)"
  }}>
    <h2 style={{
      color: winner === myId ? "#22c55e" : "#ef4444"
    }}>
      {winner === myId ? "🎉 You Won!" : "💀 You Lost!"}
    </h2>

    <button
      onClick={handleRematch}
      style={buttonStyle(resetVoted)}
      disabled={resetVoted}
    >
      Play Again 
    </button>
  </div>
)}
</div>

<div style={{
   flex: 1,
  position: "sticky",
  top: "100px",
  maxHeight: "500px",
  overflowY: "auto"
}}>
  <GameLogger logs={logs} />
</div>
</div>




    </>
    
  );
};