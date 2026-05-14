import { useEffect, useState } from "react";
import Modal from "../components/modalComponent";
import axios from "axios";
import { Navbar } from "../components/navbar";


export const Leaderboard = () => {

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData,setModalData]= useState(null);

  const showModal = (message,options = {},btnText)=>{
  const { onBtnClick } = options;

  setModalData({
    message: message,
    showBtn:btnText?true:false,
    btnText:btnText,
    onBtnClick:onBtnClick
  });
};

  useEffect(() => {

    const fetchLeaderboard = async () => {
      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/getLeaderboard`
        );

        setPlayers(res.data.players);

      } catch (err) {
       console.log(err);

  const message =
    err.response?.data?.message ||
    err.message ||
    "Something went wrong";

  showModal(message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
      }}
    >
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
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        🏆 Leaderboard
      </h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>
          Loading...
        </p>
      ) : (
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {players.map((player, index) => (
            <div
              key={player._id}
              style={{
                background: "#1e293b",
                padding: "16px",
                borderRadius: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3>
                  #{index + 1} {player.playerName}
                </h3>

                {/* <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                  }}
                >
                  Wins: {player.gamesAnalytics?.wins || 0}
                </p> */}
              </div>

              <div>
                {/* 🪙 {player.tokens} */}
                Wins: {player.gamesAnalytics?.wins || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};