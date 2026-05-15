import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Navbar } from "../components/navbar";
import Modal from "../components/modalComponent";

export const Profile = () => {
  const [userData, setUserData] = useState(null);
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

  const updateUserData = (details) => {
    setUserData({
      name: details.playerName,
      id: details._id,
      tokens: details.tokens,
      gamesAnalytics: details.gamesAnalytics || {
        totalGames: 0,
        wins: 0,
        losses: 0,
      },
    });
  };

  const getMyData = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/getMe`,
        {},
        { withCredentials: true }
      );

      updateUserData(res.data.player);
    } catch (error) {
      console.log(error);
      const message =
    error.response?.data?.message ||
    error.message ||
    "Something went wrong, please login and refresh.";

  showModal(message);
    }
  };

  useEffect(() => {
    getMyData();
  }, []);

  if (!userData) {
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
        <Navbar />
        <div
          style={{
            minHeight: "100vh",
            background: "#0f172a",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
          }}
        >
          Loading Profile...
        </div>
      </>
    );
  }

  const { totalGames = 0, wins = 0, losses = 0 } =
    userData.gamesAnalytics || {};

  const chartData = [
    { name: "Wins", value: wins },
    { name: "Losses", value: losses },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const winRate =
    totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;

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
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)",
          color: "white",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          {/* Profile Card */}
          <div
            style={{
              flex: "1 1 320px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              textAlign: "center",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                fontWeight: "bold",
                margin: "0 auto 20px",
                boxShadow: "0 10px 30px rgba(99,102,241,0.5)",
              }}
            >
              {userData.name.charAt(0).toUpperCase()}
            </div>

            <h1
              style={{
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              {userData.name}
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "14px",
                marginBottom: "20px",
                wordBreak: "break-all",
              }}
            >
              ID: {userData.id}
            </p>

            {/* <div
              style={{
                display: "inline-block",
                padding: "10px 18px",
                borderRadius: "999px",
                background: "rgba(250,204,21,0.15)",
                color: "#facc15",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
               {userData.tokens}
            </div> */}
          </div>

          {/* Stats Card */}
          <div
            style={{
              flex: "2 1 500px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                marginBottom: "24px",
              }}
            >
              📊 Game Analytics
            </h2>

            {/* Stat Boxes */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "16px",
                marginBottom: "30px",
              }}
            >
              <StatCard title="Total Games" value={totalGames} />
              <StatCard title="Wins" value={wins} color="#22c55e" />
              <StatCard title="Losses" value={losses} color="#ef4444" />
              <StatCard
                title="Win Rate"
                value={`${winRate}%`}
                color="#38bdf8"
              />
            </div>

            {/* Pie Chart */}
            <div
              style={{
                width: "100%",
                height: "320px",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    dataKey="value"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const StatCard = ({ title, value, color = "#ffffff" }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.05)",
      borderRadius: "16px",
      padding: "20px",
      textAlign: "center",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <p
      style={{
        color: "#94a3b8",
        fontSize: "14px",
        marginBottom: "8px",
      }}
    >
      {title}
    </p>
    <h3
      style={{
        fontSize: "28px",
        color,
        margin: 0,
      }}
    >
      {value}
    </h3>
  </div>
);