import { useEffect, useRef } from "react";
export const GameLogger = ({ logs, horizontal }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (horizontal && containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [logs, horizontal]);

  return (
    <div
      ref={containerRef}
      style={{
        background: "#020617",
        borderRadius: "12px",
        padding: "10px",
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        gap: "10px",
        overflowX: horizontal ? "auto" : "hidden",
        overflowY: horizontal ? "hidden" : "auto",
        maxHeight: horizontal ? "auto" : "150px"
      }}
    >
      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            whiteSpace: "nowrap",
            fontSize: "13px",
            color: "#e5e7eb",
            padding: horizontal ? "4px 10px" : "2px 0",
            background: horizontal ? "#111827" : "transparent",
            borderRadius: "6px"
          }}
        >
          • {log}
        </div>
      ))}
    </div>
  );
};