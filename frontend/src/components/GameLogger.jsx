export const GameLogger = ({ logs }) => {
  return (
    <div style={{
      marginTop: "20px",
      background: "#020617",
      borderRadius: "12px",
      padding: "12px",
      width: "100%",
      maxWidth: "500px",
      marginInline: "auto",
      boxShadow: "0 8px 30px rgba(0,0,0,0.6)"
    }}>
      <div style={{
        marginBottom: "8px",
        fontWeight: "bold",
        color: "#22c55e"
      }}>
        Game Logs
      </div>

      <div style={{
        maxHeight: "150px",
        overflowY: "auto",
        fontSize: "13px",
        color: "#e5e7eb"
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{
            padding: "2px 0",
            opacity: 0.9
          }}>
            • {log}
          </div>
        ))}
      </div>
    </div>
  );
};