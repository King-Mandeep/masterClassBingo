// components/Modal.jsx
import React from "react";

const Modal = ({
  message,
  onClose,
  showBtn = false,
  btnText = "OK",
  onBtnClick,
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        
        {/* Close Button */}
        <button style={styles.close} onClick={onClose}>
          ✖
        </button>

        {/* Message */}
        <p style={styles.message}>{message}</p>

        {/* Optional Button */}
        {showBtn && (
          <button style={styles.actionBtn} onClick={onBtnClick}>
            {btnText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // IMPORTANT
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
    position: "relative",
  },
  close: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "16px",
  },
  message: {
    margin: "20px 0",
  },
  actionBtn: {
    padding: "10px 15px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};