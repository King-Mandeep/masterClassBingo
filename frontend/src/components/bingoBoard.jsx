export const BingoBoard = ({ grid, marked,onCellClick,isMyTurn }) => {

  if (!grid || grid.length === 0) return null;

  const get2DGrid = () => {
    const result = [];
    for (let i = 0; i < 5; i++) {
      result.push(grid.slice(i * 5, i * 5 + 5));
    }
    return result;
  };

  const board = get2DGrid();

  return (
    <div style={{
    padding: "20px",
    background: "#111827",
    borderRadius: "16px",
    display: "inline-block",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  }}>
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(5, 70px)",
gap: "12px",
justifyContent: "center",
      marginTop: "20px"
    }}>
      {board.flat().map((value, index) =>
      {
        const row = Math.floor(index/5);
        const col = index % 5;
        const isMarked = marked?.[row]?.[col]===1;
return(
          <div
  key={index}
  id={`cell-${index}`}
  onClick={() => {
    if (!isMyTurn || isMarked) return;

    const el = document.getElementById(`cell-${index}`);
    if (el) {
      el.style.transform = "scale(0.85)";
      setTimeout(() => {
        el.style.transform = "scale(1)";
      }, 100);
    }

    onCellClick(index, value);
  }}

  onMouseEnter={(e) => {
    if (!isMarked && isMyTurn) {
      e.currentTarget.style.background = "#374151";
    }
  }}

  onMouseLeave={(e) => {
    if (!isMarked) {
      e.currentTarget.style.background = "#1f2937";
    }
  }}

  style={{
    width: "70px",
    height: "70px",
    background: isMarked ? "#22c55e" : "#1f2937",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: isMyTurn ? "pointer" : "not-allowed",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "18px",
    transition: "all 0.2s ease",
    transform: isMarked ? "scale(0.95)" : "scale(1)",
    boxShadow: isMarked
      ? "0 0 10px rgba(34,197,94,0.6)"
      : "0 4px 10px rgba(0,0,0,0.3)"
  }}
>
  {value}
</div>
        );
      })}
    </div>
    </div>
  );
};